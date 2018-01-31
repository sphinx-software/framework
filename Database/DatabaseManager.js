import Manager from "../Manager";

export default class DatabaseManager extends Manager {

    /**
     *
     * @param {string|null} connection
     * @return {DatabaseConnectionInterface}
     */
    connection(connection = null) {
        return this.adapter(connection);
    }

    /**
     *
     * @param {string|null} connection
     * @return {*}
     */
    query(connection = null) {
        return this.connection(connection).query();
    }

    /**
     *
     * @param table
     * @param {string|null} connection
     * @return {*}
     */
    from(table, connection = null) {
        return this.connection(connection).query().from(table);
    }
}
