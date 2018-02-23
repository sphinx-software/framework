import VError from 'verror';
import lodash from 'lodash';

/**
 * Manager
 */
export default class Manager {

    /**
     * List of resolved adapters
     *
     * @type {{}}
     */
    adapters = {};

    /**
     * The name of the default adapter
     *
     * @type {string|null}
     */
    defaultAdapter = null;

    /**
     * List adapters factories will resolved
     *
     * @type {{ driver: String }}
     */
    configAdapters = {};

    /**
     * List of factories method which will provides the adapter
     *
     * @type {{}}
     */
    factories = {};

    /**
     * Specify the default adapter
     *
     * @param {string} adapterName
     * @return {Manager}
     */
    setDefaultAdapter(adapterName) {
        this.defaultAdapter = adapterName;
        return this;
    }

    /**
     *
     * @param {{ driver: String }} configAdapters
     * @return {Manager}
     */
    setConfigAdapters(configAdapters) {
        this.configAdapters = configAdapters;
        return this;
    }

    /**
     * Extend this manager by registering an adapter factory
     *
     * @param {string} driver
     * @param {Function} driverFactory
     * @return {Manager}
     */
    extend(driver, driverFactory) {
        this.factories[driver] = driverFactory;
        return this;
    }

    /**
     * Extend this manager by registering an adapter
     *
     * @param {string} adapterName
     * @param {*} adapter
     * @return {Manager}
     */
    register(adapterName, adapter) {
        this.adapters[adapterName] = adapter;

        return this;
    }

    /**
     * Get an adapter by its name. If adapterName is not specified
     * We'll return the default one.
     *
     * @param {string|null} adapterName
     * @return {*}
     */
    adapter(adapterName = this.defaultAdapter) {

        // If adapterName still a falsy value, consider as an error
        if (!adapterName) {
            throw new VError('E_MANAGER: No adapter specified. Please specify one adapter or set a default adapter');
        }

        // If this adapter was already resolved before, we'll just return it
        if (this.adapters[adapterName]) {
            return this.adapters[adapterName];
        }

        // Otherwise, if the extended list doesn't have such adapter name
        // consider as adapter not supported
        if (!this.configAdapters[adapterName]) {
            throw new VError(`E_MANAGER: Adapter [${adapterName}] is not supported`);
        }

        let factoryFunction = lodash.isFunction(this.factories[adapterName])
            ? this.factories[adapterName] : this.factories[adapterName].make
        ;

        // If we have the adapter factory in the extend list,
        // we'll resolve the adapter and also cached it.
        this.adapters[adapterName] = factoryFunction(this.configAdapters[adapterName]);

        return this.adapters[adapterName];
    }
}
