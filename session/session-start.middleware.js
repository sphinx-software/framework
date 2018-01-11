const Session = require('./session');
const uuid    = require('uuid/v4');

module.exports = async (context, next) => {
    let container       = context.container;
    let config          = await container.make('config');
    let sessionStorage  = await container.make('session.storage');
    let sessionID       = context.cookies.get('sphinx-session-id') || uuid();
    let event           = await container.make('events');

    // Get the session with the given sessionId.
    // if no session was found, then give it a new one
    context.session = await sessionStorage.get(
        sessionID,
        new Session(await container.make('serializer'))
    );

    if(context.session.isTimeout(config.session.timeout)) {
        // Make a new session with a new session id
        sessionID = uuid();
        context.session = new Session(await container.make('serializer'));
    }

    // emit event when session started
    // other service aware to session will updated
    event.emit('session.started', context.session);

    await next();


    if (context.session.shouldDestroy()) {
        // emit event when session starting
        event.emit('session.destroying', context.session);

        // In case the session was set destroy flag explicity
        await sessionStorage.unset(sessionID);

        // emit event when session starting
        event.emit('session.destroyed', context.session);
    } else {
        // Touch the session active timestamp then
        // Store back the session data at the end of the request life cycle
        await sessionStorage.set(sessionID, context.session.touch());

        // Tell the client to store back the sessionID
        context.cookies.set('sphinx-session-id', sessionID);
    }
};
