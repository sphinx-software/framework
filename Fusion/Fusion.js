import lodash from 'lodash';
import {Config} from "./ServiceContracts";

export class Fusion {
    constructor() {
        this.modules  = [];
        this.services = [];
    }

    getByManifest(manifestField) {
        return this.services.filter(Symbol => Reflect.hasMetadata(manifestField, Symbol));
    }

    use(module) {
        this.modules.push(module);
        this.services = this.services.concat(lodash.values(module));

        return this;
    }

    async activate(config, container) {

        container.value(Config, config);
        container.value(Fusion, fusion);

        let providers = this.getByManifest('fusion.provider').map(Provider => new Provider(container, fusion));

        providers.forEach(provider => provider.register());

        let earlyBootProviders = providers.filter(provider => lodash.isFunction(provider['boot']));

        for(let index = 0; index < earlyBootProviders.length; index++) {
            await earlyBootProviders[index]['boot']();
        }

        return container;
    }
}

const fusion = new Fusion();

export default fusion;
export function provider(...tags) {
    return Reflect.metadata('fusion.provider', tags);
}
