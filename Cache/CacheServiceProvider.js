import { provider }   from '../Fusion/Fusion';
import {CacheInterface, Config} from "../Fusion/ServiceContracts";

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
            let storageFactory = await this.container.make(FactoryManager);
            let config         = await this.container.make(Config);

            return storageFactory.make(config.cache.adapter, config.cache);
        });
    }
}
