exports.register = (container) => {

    container.singleton('cache', async () => {
        let storageFactory = await container.make('storage.factory');
        let config         = await container.make('config');

        return await storageFactory.make(config.cache.adapter, config.cache);
    });
};
