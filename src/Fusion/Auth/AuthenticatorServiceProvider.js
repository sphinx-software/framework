import {provider} from "../Fusion";
import {Config} from "../ServiceContracts"
import {started} from "../Session/SessionEvents";
import Auth from "./Auth";
import AuthenticatorInterface from "./AuthenticatorInterface";

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
        this.container.singleton(AuthenticatorInterface, async () => {
            return new Auth()
        });
    }

    async boot() {
        const config       = await this.container.make(Config);
        const eventEmitter = this.container.ee;
        const auth         = await this.container.make(AuthenticatorInterface);

        auth.setSessionAuthKey(config.auth.session.sessionAuthKey);
        // when session is available, the SessionAuthenticator service will use session as a dependency
        eventEmitter.on(started, (session) => {
            auth.setSession(session)
        });
    }
}
