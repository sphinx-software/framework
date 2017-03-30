const StorageAdapter = require('./storage-adapter');

/**
 * For failover purpose only
 */
class NullStorageAdapter extends StorageAdapter {

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

module.exports = NullStorageAdapter;
