import FactoryManager from '../factory-manager';

exports.register = (container) => {

    container.singleton('cache', async () => {
        let storageFactory = await container.make(FactoryManager);
        let config         = await container.make('config');

        return storageFactory.make(config.cache.adapter, config.cache);
    });
};
