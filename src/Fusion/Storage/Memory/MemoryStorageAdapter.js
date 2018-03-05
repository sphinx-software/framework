import lodash         from 'lodash';

/**
 * For development & testing purpose only.
 * Do not use this adapter in your production environment
 *
 */
export default class MemoryStorageAdapter {

    /**
     *
     * @param {[{key: string, tags: [], value: *}]} initialData
     */
    constructor(initialData) {
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
        return this.store.filter(item => this.isNotExpired(item.expiredAt));
    }

    /**
     *
     * @param {string} tag
     * @return {Promise.<*>}
     */
    async getByTag(tag) {
        return this.loadStore().filter(item => {
            return lodash.includes(item['tags'], tag);
        }).map(item => item['value']);
    }

    /**
     *
     * @param {string} key
     * @param {*} valueIfNotExisted
     * @return {Promise.<*>}
     */
    async get(key, valueIfNotExisted = null) {
        return (lodash.find(this.loadStore(), item => item.key === key) || { value: valueIfNotExisted }).value;
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
            key      : key,
            value    : value,
            tags     : options.tags || [],
            expiredAt: this.expiredDateFromNow(options.ttl || this.defaultTTL)
        });
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
     * @protected
     * @param date
     * @param ttl
     * @return {Date}
     */
    expiredDateFrom (date, ttl) {
        return new Date(date.getTime() + ttl);
    };

    /**
     * @protected
     * @param ttl
     * @return {*}
     */
    expiredDateFromNow (ttl) {
        return this.expiredDateFrom(new Date(), ttl);
    };

    /**
     * @protected
     * @param expiredDate
     * @return {boolean}
     */
    isExpired (expiredDate) {
        return Date.now() > expiredDate.getTime();
    };

    /**
     * @protected
     * @param expiredDate
     * @return {boolean}
     */
    isNotExpired (expiredDate) {
        return !this.isExpired(expiredDate);
    };
}
