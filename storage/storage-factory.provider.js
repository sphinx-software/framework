exports.register = (container) => {

    container.singleton('storage.factory', async () => {
        return require('./storage-factory');
    });
};
