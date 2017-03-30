const Session = require('./session');

exports.register = (container) => {

    container.singleton('session.storage', async () => {

        let factory = await container.make('storage.factory');
        let config  = await container.make('config');

        let sessionConfig = config.session;
        let adapterConfig = sessionConfig.adapters[sessionConfig.use];

        adapterConfig.adapter = sessionConfig.use;

        return await factory.make(adapterConfig, container);
    });
};

exports.boot = async (container) => {

    let serializer = await container.make('serializer');

    // Let serializer know how to serialize / deserialize Session data
    serializer.forType(
        Session,

        // Extract the session's data
        (session) => session.toJson(),

        // Rebuild the session from it's session data
        (sessionData) => new Session(serializer).init(sessionData)
    )
};
