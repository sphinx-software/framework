import knex from 'knex';
import lodash from 'lodash';

export default class KnexExtensor {

    scopers     = {};

    morphers    = {};

    upgrade(knexConnection) {
        return new Proxy(knexConnection, {
            get: (target, property) => {
                if ('query' === property) {
                    return (...args) => this.upgradeBuilder(target.queryBuilder(...args));
                }

                return target[property];
            }
        });
    }

    upgradeBuilder(builder) {
        let thisExtensor        = this;
        let thisExtensorScopes  = this.scopers;

        return new Proxy(builder, {
            get: (target, property) => {

                if (this.scopers[property]) {
                    return (...args) =>
                        thisExtensor.upgradeBuilder(target.modify(thisExtensorScopes[property], ...args));
                }

                if ('morph' === property) {
                    return (...morphers) => {
                        return thisExtensor.upgradeBuilder(target.modify( builder => {
                            builder.select(target.client.raw(`? as ??`, [morphers.join('|'), '$$$__fusion_morph__']))
                        }));
                    };
                }

                return target[property];
            }
        })
    }

    handlePostProcess(result) {

        if (lodash.isArray(result) && result.length) {
            let morphers = result[0]['$$$__fusion_morph__'].split('|');

            return morphers.reduce((result, currentMorpherName) => this.morphers[currentMorpherName](result), result);
        }

        if (result['$$$__fusion_morph__']) {
            let morphers = result['$$$__fusion_morph__'].split('|');

            return morphers.reduce((result, currentMorpherName) => this.morphers[currentMorpherName](result), result);
        }

        return result;
    }

    registerMorpher(name, morpher) {
        this.morphers[name] = morpher;
        return this;
    }

    registerScoper(name, scoper) {
        this.scopers[name] = scoper;
        return this;
    }
}
