import FactoryManager from '../FactoryManager';
import { provider }   from '../Fusion/Fusion';
import {CacheInterface} from "../Fusion/ServiceContracts";

@provider()
export class CacheServiceProvider {

    constructor(container, fusion) {
        this.container = container;
        this.fusion    = fusion;
    }

    register() {
        this.container.singleton(CacheInterface, async () => {
            let storageFactory = await this.container.make(FactoryManager);
            let config         = await this.container.make('config');

            return storageFactory.make(config.cache.adapter, config.cache);
        });
    }
}
