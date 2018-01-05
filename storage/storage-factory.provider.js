const FactoryManager = require('../factory-manager');
const adapters       = require('./adapters');
const path           = require('path');

exports.register = (container) => {

    container.singleton('storage.factory', async () => {
        return new FactoryManager({
            'null'          : async () => new adapters.NullStorageAdapter(),

            'memory'        : async () => new adapters.MemoryStorageAdapter([]),

            'filesystem'    : async (adapterConfiguration) => {
                const CacheFileNamingConvention = require('./adapters/filesystem/storage-file-naming-convention');

                return new adapters.FilesystemStorageAdapter(
                    await container.make('serializer'),
                    require('fs'),
                    new CacheFileNamingConvention().setPrefix(adapterConfiguration.prefix)
                ).setStorageDirectory(path.normalize(adapterConfiguration.directory))
            }
        });
    });
};
