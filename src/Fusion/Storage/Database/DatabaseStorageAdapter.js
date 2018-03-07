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
     * @type {Number}
     */
    ttl        = null;

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

    setDefaultTTL(ttl) {
        this.ttl = ttl;
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
     * @param valueDefaultIfNotExist
     * @param options
     * @return {Promise<*>}
     */
    async get(key, valueDefaultIfNotExist = null, options = {}) {
        let now = new Date().getTime();
        let ttl = options.ttl || this.ttl;

        let data = await this.connection.query()
            .from(this.table)
            .where('key', '=', key)
            .where('created_at', '>=', now - ttl)
            .first();

        if (!data) {
            return valueDefaultIfNotExist;
        }

        return data? this.serializer.deserialize(data.value) : valueDefaultIfNotExist;
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