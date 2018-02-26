export default class DatabaseStorageAdapter {

    /**
     *
     * @type {DatabaseConnectionInterface}
     */
    connection = null;

    /**
     *
     * @type {Serializer}
     */
    serializer = null;

    /**
     *
     * @type {String}
     */
    table      = null;

    /**
     *
     * @param connection
     * @param {Serializer} serializer
     */
    constructor(connection, serializer) {
        this.connection = connection;
        this.serializer = serializer;
    }

    /**
     *
     * @param table
     * @return {DatabaseStorageAdapter}
     */
    setTable(table) {
        this.table = table;
        return this;
    }

    /**
     *
     * @param key
     * @param value
     * @return {Promise<void>}
     */
    set(key, value) {
        return this.connection.query().from(this.table)
            .insert({
                key: key,
                value: this.serializer.serialize(value),
                created_at: new Date().getTime()
            });
    }

    /**
     * @param key
     * @param options
     * @return {Promise<*>}
     */
    async get(key, options = null) {
        let now = new Date().getTime();
        let data = await this.connection.query()
            .from(this.table)
            .where('key', '=', key)
            .orderBy('created_at', 'desc')
            .first();

        if (!data || options && (now > options.expiredTime + data.created_at)) {
            return null
        }

        return this.serializer.deserialize(data.value);
    }

    /**
     *
     * @param key
     * @return {Promise<void>}
     */
    unset(key) {
        return this.connection.query().from(this.table).where('key', '=', key).del();
    }
}