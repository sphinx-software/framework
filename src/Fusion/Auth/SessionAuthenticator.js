/**
 * Authenticator Service via Session
 */
export default class SessionAuthenticator {

    constructor() {
        this.sessionAuthKey = null;
        this.session        = null;
    }

    /**
     * set session for auth service as a dependence
     * @param session
     * @return {SessionAuthenticator}
     */
    setSession(session) {
        this.session = session;
        return this;
    }

    /**
     *
     * @param keyName
     * @return {SessionAuthenticator}
     */
    setSessionAuthKey(keyName) {
        this.sessionAuthKey = keyName;
        return this;
    }

    /**
     * login with a credential
     * store credential to session
     * @param credential
     * @return {SessionAuthenticator}
     */
    login(credential) {
        this.session.set(this.sessionAuthKey, credential);
        return this;
    }

    /**
     * logout
     * @return {SessionAuthenticator}
     */
    logout() {
        this.session.unset(this.sessionAuthKey);
        return this;
    }

    /**
     * check user is guest
     * @return {boolean}
     */
    guest() {
        return !this.loggedIn();
    }

    /**
     * check user is logged
     * @return {boolean}
     */
    loggedIn() {
        return this.session.has(this.sessionAuthKey);
    }

    /**
     * get back credential from session
     * @return {Credential}
     */
    getCredential() {
        return this.session.get(this.sessionAuthKey);
    }
}
