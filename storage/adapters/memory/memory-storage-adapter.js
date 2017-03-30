const StorageAdapter = require('./../storage-adapter');

const lodash         = require('lodash');
const utils          = require('./../utils');

/**
 * For development & testing purpose only.
 * Do not use this adapter in your production environment
 *
 * @class
 */
class MemoryStorageAdapter extends StorageAdapter {

    /**
     *
     * @param {[{key: string, tags: [], value: *}]} initialData
     */
    constructor(initialData) {
        super();
        this.store = initialData;
    }

    /**
     * Set the default TTL
     *
     * @param {Number} defaultTTL
     * @return {MemoryStorageAdapter}
     */
    setDefaultTTL(defaultTTL) {
        this.defaultTTL = defaultTTL;
        return this;
    }

    /**
     *
     * @return {Array.<T>}
     */
    loadStore() {
        return this.store.filter(item => utils.isNotExpired(item.expiredAt));
    }

    /**
     *
     * @param {string} tag
     * @return {Promise.<*>}
     */
    async getByTag(tag) {
        return this.loadStore()
            .filter(item => {
                return lodash.includes(item['tags'], tag)
            })
            .map(item => item['value']);
    }

    /**
     *
     * @param {string} key
     * @param {*} valueIfNotExisted
     * @return {Promise.<*>}
     */
    async get(key, valueIfNotExisted = null) {
        return (lodash.find(this.loadStore(), item => item.key === key) || {value: valueIfNotExisted}).value;
    }

    /**
     *
     * @param {string} key
     * @param {*} value
     * @param {{ttl: Number, tags: []}} options
     * @return {Promise.<void>}
     */
    async set(key, value, options = {}) {
        this.store.push({
            key         : key,
            value       : value,
            tags        : options.tags || [],
            expiredAt   : utils.expiredDateFromNow(options.ttl || this.defaultTTL)
        })
    }

    /**
     *
     * @param key
     * @return {Promise.<void>}
     */
    async unset(key) {
        lodash.remove(this.store, item => item.key === key);
    }

    /**
     *
     * @return {Promise.<void>}
     */
    async flush() {
        this.store = [];
    }

    /**
     *
     * @return {Promise.<void>}
     */
    async cleanup() {
        this.store = this.loadStore();
    }

    /**
     *
     * @return {Promise.<void>}
     */
    async prepare() { }
}

module.exports = MemoryStorageAdapter;
