class MongoStorageAdapter {

    /**
     *
     * @param mongo
     * @param serializer
     * @param {MongoTaggingStrategy} taggingStrategy
     * @param {MongoExpirationStrategy} expirationStrategy
     */
    constructor(mongo, serializer, taggingStrategy, expirationStrategy) {
        this.mongo              = mongo;
        this.taggingStrategy    = taggingStrategy;
        this.expirationStrategy = expirationStrategy;
        this.serializer         = serializer;
    }

    /**
     *
     * @param {Number} defaultTTL
     * @return {MongoStorageAdapter}
     */
    setDefaultTTL(defaultTTL) {
        this.defaultTTL = defaultTTL;
        return this;
    }

    /**
     *
     * @param {string} collection
     * @return {MongoStorageAdapter}
     */
    setStorageCollection(collection) {
        this.collection = collection;
        return this;
    }

    /**
     *
     * @param {string} tag
     * @return {Promise.<array>}
     */
    async getByTag(tag) {
        let spec    = {};

        this.expirationStrategy.queryForNotExpired(spec);
        this.taggingStrategy.queryForTag(tag, spec);
        let result  = await this.mongo.collection(this.collection).find(spec).toArray();

        return result.map( record => this.serializer.deserialize(record.value));
    }

    /**
     *
     * @param {string} key
     * @param {*} valueIfNotExisted
     * @return {Promise.<*>}
     */
    async get(key, valueIfNotExisted = null) {
        let spec = {};
        this.expirationStrategy.queryForNotExpired(spec);

        spec.key = key;

        let result = await this.mongo.collection(this.collection).find(spec).next();

        if (!result) {
            return valueIfNotExisted;
        }

        return this.serializer.deserialize(result.value);
    }

    /**
     *
     * @param {string} key
     * @param {*} value
     * @param options
     * @return {Promise.<void>}
     */
    async set(key, value, options = {}) {
        await this.mongo.collection(this.collection).update(
            { key : key},
            {
                key         : key,
                value       : this.serializer.serialize(value),
                expiredAt   : this.expirationStrategy.calculateExpiredTime(options.ttl || this.defaultTTL),
                tags        : this.taggingStrategy.generateTagsField(options.tags || [])
            },
            { upsert: true }
        );
    }

    /**
     *
     * @param {string} key
     * @return {Promise.<void>}
     */
    async unset(key) {
        await this.mongo.collection(this.collection).deleteOne({key: key});
    }

    /**
     *
     * @return {Promise.<void>}
     */
    async flush() {
        await this.mongo.collection(this.collection).deleteMany({});
    }

    /**
     *
     * @return {Promise.<void>}
     */
    async cleanup() {
        let spec = {};
        this.expirationStrategy.queryForExpired(spec);
        this.mongo.collection(this.collection).deleteMany(spec);
    }

    async prepare() { }
}

module.exports = MongoStorageAdapter;