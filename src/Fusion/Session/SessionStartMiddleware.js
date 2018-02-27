import Session from './Session';
import uuid from 'uuid/v4';
import {singleton} from "../MetaInjector";
import {Config, SerializerInterface, SessionStorageInterface} from "../ServiceContracts";
import {started, destroyed, destroying} from './SessionEvents';
import {middleware} from "../Http";

@singleton(Config, SessionStorageInterface)
@middleware()
export default class SessionStartMiddleware {
    constructor(config, sessionStorage) {
        this.config = config;
        this.storage = sessionStorage;
    }

    async handle(context, next) {
        let container       = context.container;
        let sessionID       = context.cookies.get('sphinx-session-id') || uuid();
        let eventEmitter    = context.container.ee;

        // Get the session with the given sessionId.
        // if no session was found, then give it a new one
        context.session = await this.storage.get(
            sessionID,
            new Session(await container.make(SerializerInterface))
        );

        if(context.session.isTimeout(this.config.session.timeout)) {
            // Make a new session with a new session id
            sessionID = uuid();
            context.session = new Session(await container.make(SerializerInterface));
        }

        eventEmitter.emit(started, context.session);

        await next();

        if (context.session.shouldDestroy()) {
            eventEmitter.emit(destroying, context.session);
            // In case the session was set destroy flag explicity
            await this.storage.unset(sessionID);
            eventEmitter.emit(destroyed, context.session);
        } else {
            // Touch the session active timestamp then
            // Store back the session data at the end of the request life cycle
            await this.storage.set(sessionID, context.session.touch());

            // Tell the client to store back the sessionID
            context.cookies.set('sphinx-session-id', sessionID);
        }
    }
}
