const StorageAdapter = require('./../storage-adapter');

/**
 *
 */
class DatabaseStorageAdapter extends StorageAdapter {

    /**
     *
     * @param {knex} connection
     * @param {Serializer} serializer
     * @param {DatabaseTaggingStrategy} taggingStrategy
     * @param {DatabaseExpirationStrategy} expirationStrategy
     */
    constructor(connection, serializer, taggingStrategy, expirationStrategy) {
        super();

        this.connection = connection;
        this.serializer = serializer;

        this.taggingStrategy    = taggingStrategy;
        this.expirationStrategy = expirationStrategy
    }

    /**
     *
     * @param {string} table
     * @return {DatabaseStorageAdapter}
     */
    setStorageTable(table) {
        this.table = table;
        return this;
    }

    /**
     *
     * @param {Number} defaultTTL
     * @return {DatabaseStorageAdapter}
     */
    setDefaultTTL(defaultTTL) {
        this.defaultTTL = defaultTTL;
        return this;
    }

    /**
     *
     * @param tag
     * @return {Promise.<Array>}
     */
    async getByTag(tag) {
        let rawData = await this.taggingStrategy.generateTagQuery(
            tag,
            this.expirationStrategy.queryForNotExpired(this.connection.from(this.table))
        );

        if (!rawData) {
            return [];
        }

        return rawData.map( record => this.serializer.deserialize(record));
    }

    /**
     *
     * @param key
     * @param valueIfNotExisted
     * @return {Promise.<*>}
     */
    async get(key, valueIfNotExisted = null) {

        let rawResult = await this.expirationStrategy.queryForNotExpired(
            this.connection.from(this.table).where({key: key})
        );

        if (!rawResult.length) {
            return valueIfNotExisted;
        }

        return this.serializer.deserialize(rawResult[0].value);
    }

    /**
     *
     * @param key
     * @param value
     * @param options
     * @return {Promise.<void>}
     */
    async set(key, value, options = {}) {
        let item = {
            key         : key,
            value       : this.serializer.serialize(value),
            expired_at  : this.expirationStrategy.calculateExpiredTime(options.ttl || this.defaultTTL),
            tags        : this.taggingStrategy.generateTagsField(options.tags || [])
        };

        // First try update
        let tryUpdate = await this.connection.update(item).where({key: key}).from(this.table);

        // If 0 rows was affected. So we'll do an insert instead
        if (!tryUpdate) {
            await this.connection.insert(item).into(this.table);
        }
    }

    /**
     *
     * @param key
     * @return {Promise.<void>}
     */
    async unset(key) {
        await this.connection.from(this.table).where('key', key).del();
    }

    /**
     *
     * @return {Promise.<void>}
     */
    async flush() {
        await this.connection.from(this.table).truncate();
    }

    /**
     *
     * @return {Promise.<void>}
     */
    async cleanup() {
        await this.expirationStrategy.queryForExpired(this.connection.from(this.table)).del();
    }

    /**
     *
     * @return {Promise.<void>}
     */
    async prepare() {
        await this.connection.schema.createTableIfNotExists(this.table, function (table) {
            table.increments();
            table.string('key');
            table.string('value');
            table.string('tags');
            table.integer('expired_at').unsigned();
        });
    }
}

module.exports = DatabaseStorageAdapter;
