import Credential from "./Credential";
const VError = require('verror');

/**
 * @implements CredentialProviderInterface
 */
export default class DatabaseCredentialProvider {

    /**
     *
     * @param database
     * @param hash
     */
    constructor(database, hash) {
        this.hash     = hash;
        this.database = database;
    }

    /**
     *
     * @param identityField
     * @return {DatabaseCredentialProvider}
     */
    setIdentityField(identityField) {
        this.identityField = identityField;
        return this;
    }

    /**
     *
     * @param passwordField
     * @return {DatabaseCredentialProvider}
     */
    setPasswordField(passwordField) {
        this.passwordField = passwordField;
        return this;
    }

    /**
     *
     * @param table
     * @return {DatabaseCredentialProvider}
     */
    setTableName(table) {
        this.table = table;
        return this;
    }

    /**
     *
     * @param {string} username
     * @param {string} password
     * @return {Promise<Credential>}
     */
    async provide(username, password) {
        // get credential via username
        const raw = (await this.database.table(this.table)
            .where({[this.identityField]: username})
            .limit(1))[0]
        ;

        // if credential exists check the password is valid
        if ( ! raw || ! await this.hash.check(password, raw[this.passwordField])) {
            throw new VError('E_AUTH: Invalid username or password');
        }

        return new Credential(raw);
    }
}
