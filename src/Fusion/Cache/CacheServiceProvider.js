import { provider }   from '../Fusion';
import {CacheInterface, Config} from "../ServiceContracts";
import VError from 'verror';

/**
 * Provides CacheStorage
 */
@provider()
export default class CacheServiceProvider {

    /**
     *
     * @param {Container} container
     * @param {Fusion} fusion
     */
    constructor(container, fusion) {
        this.container = container;
        this.fusion    = fusion;
    }

    /**
     * 
     */
    register() {
        this.container.singleton(CacheInterface, async () => {
            let config            = await this.container.make(Config);
            let adapterConfig     = config.cache.stores[config.cache.use];

            if (!adapterConfig) {
                throw new VError(`E_CACHE_STORE: Invalid store configuration. The store [${config.cache.use}] is not configured. `);
            }

            let PickedAdapter     = this.fusion.getByManifest('storage.factory')
                .find(Adapter => adapterConfig.adapter === Reflect.getMetadata('storage.factory', Adapter));

            if (!PickedAdapter) {
                throw new VError(`E_CACHE_ADAPTER: Adapter [${adapterConfig.adapter}] is not supported`);
            }

            let pickedAdapter = await this.container.make(PickedAdapter);

            return pickedAdapter.make(adapterConfig);
        });
    }
}
