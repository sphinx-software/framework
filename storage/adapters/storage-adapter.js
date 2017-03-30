class StorageAdapter {
    setDefaultTTL(defaultTTL) {
        throw new Error('Not Implemented');
    }

    async getByTag(tag) {
        throw new Error('Not Implemented');
    }

    async get(key, valueIfNotExisted = null) {
        throw new Error('Not Implemented');
    }

    async set(key, value, options = {}) {
        throw new Error('Not Implemented');
    }

    async unset(key) {
        throw new Error('Not Implemented');
    }

    async flush() {
        throw new Error('Not Implemented');
    }

    async cleanup() {
        throw new Error('Not Implemented');
    }

    async prepare() {
        throw new Error('Not Implemented');
    }
}

module.exports = StorageAdapter;