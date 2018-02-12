import {provider} from "../Fusion";
import SessionAuthenticator from "./SessionAuthenticator";
import {Config, DatabaseManagerInterface, HasherInterface, SerializerInterface} from "../ServiceContracts"
import MongodbCredentialProvider from "./Credential/MongodbCredentialProvider";
import DatabaseCredentialProvider from "./Credential/DatabaseCredentialProvider";
import CredentialProviderInterface from "./Credential/CredentialProviderInterface";
import Credential from "./Credential/Credential";
import {started} from "../Session/SessionEvents";


@provider()
export default class AuthenticatorServiceProvider {

    /**
     *
     * @param container
     * @param fusion
     */
    constructor(container, fusion) {
        this.container = container;
        this.fusion    = fusion;
    }

    register() {
        this.container.singleton(SessionAuthenticator, async () => {
            return new SessionAuthenticator();
        });

        this.container.singleton(CredentialProviderInterface, async () => {
            const config = await this.container.make(Config);
            const databaseManager = await this.container.make(DatabaseManagerInterface);
            let credentialProvider = null;

            if (config.auth.adapter === "mongodb") {
                credentialProvider = new MongodbCredentialProvider(
                    await this.container.make('mongodb'),
                    await this.container.make(HasherInterface)
                );
            } else {
                credentialProvider = new DatabaseCredentialProvider(
                    databaseManager.connection(),
                    await this.container.make(HasherInterface)
                );
            }

            return credentialProvider
        }).made(CredentialProviderInterface, async (credentialProvider) => {
            const config = await this.container.make("config");
            if (credentialProvider instanceof DatabaseManagerInterface) {
                credentialProvider
                    .setTableName(config.auth.adapters.database["credentialTable"])
                    .setIdentityField(config.auth.adapters.database["usernameField"])
                    .setPasswordField(config.auth.adapters.database["passwordField"])
            } else {
                credentialProvider
                    .setTableName(config.auth.adapters.mongodb["credentialCollection"])
                    .setIdentityField(config.auth.adapters.mongodb["usernameField"])
                    .setPasswordField(config.auth.adapters.mongodb["passwordField"])
            }
        })
    }


    async boot() {
        const config       = await this.container.make(Config);
        const eventEmitter = this.container.ee;
        const serializer   = await this.container.make(SerializerInterface);

        let sessionAuthenticator = await this.container.make(SessionAuthenticator);
        sessionAuthenticator.setSessionAuthKey(config.auth.session.sessionAuthKey);
        // when session is available, the SessionAuthenticator service will use session as a dependency
        eventEmitter.on(started, (session) => {
            sessionAuthenticator.setSession(session)
        });


        // register a Credential type
        serializer.forType(Credential, (credential) => {
            return credential.getIdentity()
        },  (raw) => {
            return new Credential(raw)
        });
    }
}
