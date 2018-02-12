const VError = require('verror');
import Credential from './Credential';

/**
 * * @implements CredentialProviderInterface
 */
export default class MongodbCredentialProvider {

    /**
     *
     * @param mongodb
     * @param hash
     */
    constructor(mongodb, hash) {
        this.hash    = hash;
        this.mongodb = mongodb;
    }

    /**
     *
     * @param identityField
     * @return {MongodbCredentialProvider}
     */
    setIdentityField(identityField) {
        this.identityField = identityField;
        return this;
    }

    /**
     *
     * @param passwordField
     * @return {MongodbCredentialProvider}
     */
    setPasswordField(passwordField) {
        this.passwordField = passwordField;
        return this;
    }

    /**
     *
     * @param collection
     * @return {MongodbCredentialProvider}
     */
    setCollectionName(collection) {
        this.collection = collection;
        return this;
    }

    /**
     *
     * @param {string} username
     * @param {string} password
     * @return {*}
     */
    async provide(username, password) {

        // get credential via username
        const raw = await this.mongodb[this.collection].findOne({[this.identityField]: username});

        // if credential exists check the password is valid
        if ( ! raw || ! await this.hash.check(password, raw[this.passwordField])) {
            throw new VError('E_AUTH: Invalid username or password');
        }

        return new Credential(raw);
    }
}
