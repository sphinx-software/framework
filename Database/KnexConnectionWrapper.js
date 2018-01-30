export default class KnexConnectionWrapper {

    /**
     *
     * @param prefix
     */
    setPrefix(prefix) {
        this.prefix = prefix;
    }

    setQueryScope() {

    }

    scope() {

    }

    /**
     *
     * @param knexConnection
     */
    constructor(knexConnection) {
        this.knexConnection = knexConnection;
    }

    /**
     * Create a new SQL query
     *
     * @param {string} table
     */
    query(table) {
        return this.knexConnection(this.prefix + table);
    }

    /**
     * Run an SQL query
     *
     * @param query
     * @return {Promise<void>}
     */
    async execute(query) { }

    /**
     * Run a database transaction
     *
     * @param procedure
     * @return {Promise<void>}
     */
    async transaction(procedure) { }

    /**
     * Get the schema builder
     */
    schema() { }
}