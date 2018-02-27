import lodash from 'lodash';
import {Config} from "./ServiceContracts";
import chalk from 'chalk';

/**
 * The Fusion core.
 * This class will helps us for loading modules into it and also manges it's services via decorators
 */
export class Fusion {
    constructor() {
        this.modules  = [];
        this.services = [];
    }

    /**
     * List of loaded services
     * @type {Array}
     */
    service = [];

    /**
     * Load all services by give metadata key (via class decorator)
     *
     * @param {string} manifestField
     */
    getByManifest(manifestField) {
        return this.services.filter(Symbol => Reflect.hasMetadata(manifestField, Symbol));
    }

    /**
     * Load a module
     *
     * @param {*} module
     * @return {Fusion}
     */
    use(module) {
        this.modules.push(module);
        this.services = this.services.concat(lodash.values(module));

        return this;
    }

    /**
     * Load all of the service providers and start bootstrap them
     *
     * @param config
     * @param container
     * @param {function} registerPhaseHandler
     * @param {function} bootPhaseHandler
     * @return {Promise<*>}
     */
    async activate(config, container, registerPhaseHandler = async () => {}, bootPhaseHandler = async () => {}) {

        // Pre inject the configuration & fusion itself
        container.value(Config, config);
        container.value(Fusion, fusion);

        // Load all of service providers & bootstrap them
        let providers = this.getByManifest('fusion.provider').map(Provider => new Provider(container, fusion));

        providers.forEach(provider => {
            provider.register();
        });

        await registerPhaseHandler();

        let havingBootProviders = providers.filter(provider => lodash.isFunction(provider.boot));

        for(let index = 0; index < havingBootProviders.length; index ++) {
            let provider = havingBootProviders[index];
            // early booted
            await provider.boot();
        }

        await bootPhaseHandler();

        return container;
    }
}

const fusion = new Fusion();

export default fusion;
export function provider(...tags) {
    return Reflect.metadata('fusion.provider', tags);
}
