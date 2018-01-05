const VError = require('verror');

class FactoryManager {
    constructor(adapterFactories = {}) {
        this.factories = adapterFactories;
    }

    register(adapterName, adapterFactory) {
        this.factories = adapterFactory;
        return this;
    }

    async make(adapterName, ...factoryParameters) {
        let factory = this.factories[adapterName];

        if (!factory) {
            throw new VError(`E_FACTORY: The adapter [${adapterName}] is not supported`);
        }

        return await factory(...factoryParameters);
    }
}

module.exports = FactoryManager;
