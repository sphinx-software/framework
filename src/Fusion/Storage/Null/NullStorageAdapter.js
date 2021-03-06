/**
 * For failover purpose only
 */
export default class NullStorageAdapter {

    async getByTag(tag) {
        return [];
    }

    async get(key, valueIfNotExisted = null) {
        return null;
    }

    setDefaultTTL(defaultTTL) {
        this.defaultTTL = defaultTTL;
        return this;
    }

    async set(key, value, options = {}) { }

    async unset(key) { }

    async flush() { }

    async cleanup() { }

    async prepare() { }
}

