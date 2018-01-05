const Session               = require('./session');
const SessionClearCommand   = require('./session-clear.command');

exports.register = (container) => {

    container.singleton('session.storage', async () => {

        let factory = await container.make('storage.factory');
        let config  = await container.make('config');

        let sessionConfig = config.session;
        let adapterConfig = sessionConfig.adapters[sessionConfig.use];

        return await factory.make(sessionConfig.use, adapterConfig);
    });

    container.singleton('command.session-clear', async () => {
        return new SessionClearCommand(await container.make('session.storage'));
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
    );


    let consoleKernel = await container.make('console.kernel');
    await consoleKernel.register('command.session-clear');
};
