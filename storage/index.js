import fs                        from 'fs';
import path                      from 'path';
import * as adapters             from './adapters';
import { provider }              from '../Fusion/Fusion';
import FactoryManager            from '../factory-manager';
import CacheFileNamingConvention from './adapters/filesystem/storage-file-naming-convention';

@provider()
export default class StorageServiceProvider {

    constructor(container, fusion) {
        this.container = container;
        this.fusion    = fusion;
    }

    register() {

        this.container.singleton(FactoryManager, async () => {
            return new FactoryManager({
                'null': async () => new adapters.NullStorageAdapter(),

                'memory': async () => new adapters.MemoryStorageAdapter([]),

                'filesystem': async (adapterConfiguration) => {
                    return new adapters.FilesystemStorageAdapter(
                        await this.container.make('serializer'),
                        fs,
                        new CacheFileNamingConvention().setPrefix(
                            adapterConfiguration.prefix)
                    ).setStorageDirectory(
                        path.normalize(adapterConfiguration.directory));
                }
            });
        });

    }

}
