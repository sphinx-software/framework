import Session from './Session';
import {provider} from "../Fusion/Fusion";
import FactoryManager from "../Manager";
import {Config, SerializerInterface, SessionStorageInterface} from "../Fusion/ServiceContracts";

export SessionClearCommand from "./SessionClearCommand";
export SessionStartMiddleware from "./SessionStartMiddleware";

@provider()
export default class SessionProvider {
    constructor(container, fusion) {
        this.container = container;
        this.fusion    = fusion;
    }

    register() {
        this.container.singleton(SessionStorageInterface, async () => {

            let factory = await this.container.make(FactoryManager);
            let config  = await this.container.make(Config);

            let sessionConfig = config.session;
            let adapterConfig = sessionConfig.adapters[sessionConfig.use];

            return await factory.make(sessionConfig.use, adapterConfig);
        });
    }

    async boot() {
        let serializer = await this.container.make(SerializerInterface);

        // Let serializer know how to serialize / deserialize Session data
        serializer.forType(
            Session,

            // Extract the session's data
            (session) => session.toJson(),

            // Rebuild the session from it's session data
            (sessionData) => new Session(serializer).init(sessionData)
        );

    }
}
