const adapters = require('./adapters');
const path     = require('path');
const VError   = require('verror');

class StorageAdapterFactory {

    /**
     *
     * @param adapterConfiguration
     * @param container
     * @return {Promise}
     */
    static async make(adapterConfiguration, container) {
        switch (adapterConfiguration['adapter']) {
            case 'null':
                return StorageAdapterFactory.makeNullAdapter();
            case 'memory':
                return StorageAdapterFactory.makeMemoryAdapter();
            case 'filesystem':
                return StorageAdapterFactory.makeFilesystemAdapter(adapterConfiguration, container);
            case 'database':
                return StorageAdapterFactory.makeDatabaseAdapter(adapterConfiguration, container);
            case 'mongo':
                return StorageAdapterFactory.makeMongoAdapter(adapterConfiguration, container);
            default:
                throw new VError('E_STORAGE: Adapter [%s] is not supported', adapterConfiguration['adapter']);
        }
    }

    /**
     *
     * @return {Promise.<NullStorageAdapter>}
     */
    static async makeNullAdapter() {
        return new adapters.NullStorageAdapter();
    }

    /**
     *
     * @return {Promise.<MemoryStorageAdapter>}
     */
    static async makeMemoryAdapter() {
        return new adapters.MemoryStorageAdapter([]);
    }

    /**
     *
     * @param adapterConfiguration
     * @param container
     * @return {Promise.<FileSystemAdapter>}
     */
    static async makeFilesystemAdapter(adapterConfiguration, container) {

        const CacheFileNamingConvention = require('./adapters/filesystem/storage-file-naming-convention');

        return new adapters.FilesystemStorageAdapter(
            await container.make('serializer'),
            require('fs'),
            new CacheFileNamingConvention().setPrefix(adapterConfiguration.prefix)
        ).setStorageDirectory(path.normalize(adapterConfiguration.directory));
    }

    /**
     *
     * @param adapterConfiguration
     * @param container
     * @return {Promise.<DatabaseStorageAdapter>}
     */
    static async makeDatabaseAdapter(adapterConfiguration, container) {
        const DatabaseTaggingStrategy    = require('./adapters/database/database-tagging-strategy');
        const DatabaseExpirationStrategy = require('./adapters/database/database-expiration-strategy');

        return new adapters.DatabaseStorageAdapter(
            await container.make('database'),
            await container.make('serializer'),
            new DatabaseTaggingStrategy(),
            new DatabaseExpirationStrategy()
        ).setDefaultTTL(adapterConfiguration.ttl).setStorageTable(adapterConfiguration.table);
    }

    /**
     *
     * @param adapterConfiguration
     * @param container
     * @return {Promise.<MongoStorageAdapter>}
     */
    static async makeMongoAdapter(adapterConfiguration, container) {
        const MongoTaggingStrategy    = require('./adapters/mongo/mongo-tagging-strategy');
        const MongoExpirationStrategy = require('./adapters/mongo/mongo-expiration-strategy');

        return new adapters.MongoStorageAdapter(
            await container.make('mongo'),
            await container.make('serializer'),
            new MongoTaggingStrategy(),
            new MongoExpirationStrategy()
        ).setDefaultTTL(adapterConfiguration.ttl).setStorageCollection(adapterConfiguration.collection);
    }
}

module.exports = StorageAdapterFactory;
