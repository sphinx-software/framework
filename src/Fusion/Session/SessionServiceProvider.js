import {Config, SerializerInterface, SessionStorageInterface} from "../ServiceContracts";
import Session from "./Session";
import {provider} from "../Fusion";
import VError from "verror";

@provider()
export default class SessionProvider {
    constructor(container, fusion) {
        this.container = container;
        this.fusion    = fusion;
    }

    register() {
        this.container.singleton(SessionStorageInterface, async () => {

            let config            = await this.container.make(Config);
            let adapterConfig     = config.session.stores[config.session.use];

            if (!adapterConfig) {
                throw new VError(`E_SESSION_STORE: Invalid store configuration. The store [${config.session.use}] is not configured. `);
            }

            let PickedAdapter     = this.fusion.getByManifest('storage.factory')
                .find(Adapter => adapterConfig.adapter === Reflect.getMetadata('storage.factory', Adapter));

            if (!PickedAdapter) {
                throw new VError(`E_SESSION_ADAPTER: Adapter [${adapterConfig.adapter}] is not supported`);
            }

            let pickedAdapter = await this.container.make(PickedAdapter);

            return pickedAdapter.make(adapterConfig);
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
