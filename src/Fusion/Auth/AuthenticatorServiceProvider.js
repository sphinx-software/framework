import {provider} from "../Fusion";
import SessionAuthenticator from "./SessionAuthenticator";
import {Config, DatabaseManagerInterface, HasherInterface} from "../ServiceContracts"
import MongodbCredentialProvider from "./Credential/MongodbCredentialProvider";
import DatabaseCredentialProvider from "./Credential/DatabaseCredentialProvider";
import CredentialProviderInterface from "./Credential/CredentialProviderInterface";


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
            const config = await this.container.make(Config);
            return new SessionAuthenticator()
                .setSessionAuthKey(config.auth.session.sessionAuthKey)
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
        })
    }

    async boot() {

    };
}
