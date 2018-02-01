import lodash from 'lodash';

export default class KnexExtensor {

    scopers     = {};

    morphers    = {};

    defaultMorphers = [];

    defaultScopers  = [];

    upgrade(knexConnection) {
        let defaultScopers = this.defaultScopers;
        let scopers        = this.scopers;

        return new Proxy(knexConnection, {
            get: (target, property) => {
                if ('query' === property) {


                    return (...args) => {

                        let query = target.queryBuilder(...args);

                        defaultScopers.reduce( (query, scoperName) => query.modify(scopers[scoperName]), query);

                        return this.upgradeBuilder(query);
                    }
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

        if (lodash.isArray(result) && result.length && result[0]['$$$__fusion_morph__']) {
            let morphers = result[0]['$$$__fusion_morph__'].split('|');

            return morphers.reduce((result, currentMorpherName) => this.morphers[currentMorpherName](result), result);
        }

        if (result['$$$__fusion_morph__']) {
            let morphers = result['$$$__fusion_morph__'].split('|');

            return morphers.reduce((result, currentMorpherName) => this.morphers[currentMorpherName](result), result);
        }

        return result;
    }

    registerMorpher(name, morpher, isDefault = false) {
        this.morphers[name] = morpher;
        if (isDefault) {
            this.defaultMorphers.push(name);
        }
        return this;
    }

    registerScoper(name, scoper, isDefault = false) {
        this.scopers[name] = scoper;
        if (isDefault) {
            this.defaultScopers.push(name);
        }
        return this;
    }
}
