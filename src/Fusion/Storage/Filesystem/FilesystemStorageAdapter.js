import path from 'path';

export default class FileSystemAdapter {

    serializer;

    naming;

    fs;

    /**
     *
     * @param {SerializerInterface} serializer
     * @param {StorageFileNamingConvention} naming
     * @param fs
     */
    constructor(serializer, naming, fs) {
        this.serializer = serializer;
        this.naming     = naming;
        this.fs         = fs;
    }

    /**
     *
     *
     * @param {string} directory
     * @return {FileSystemAdapter}
     */
    setStorageDirectory(directory) {
        this.directory = directory;
        return this;
    }

    /**
     *
     * @param ttl time to live
     * @return {FileSystemAdapter}
     */
    setDefaultTTL(ttl) {
        this.ttl = ttl;
        return this;
    }

    /**
     *
     * @param {string} key
     * @param {*} valueIfNotExisted
     * @param {Object} options
     * @return {Promise.<*>}
     */
    async get(key, valueIfNotExisted = null, options = {}) {
        let now = new Date().getTime();
        let fileName  = this.naming.nameFor(this.directory, key);

        // use default ttl when the ttl option is not exist
        let ttl = options.ttl? options.ttl : this.ttl;

        // Don't reject the error.
        // Considering any error occurred as no data
        let serializedData = null;
        try {
            serializedData = this.fs.readFileSync(fileName);
        } catch (error) {
            return valueIfNotExisted;
        }

        // when the value not exist
        if (!serializedData) {
            return valueIfNotExisted;
        }

        // When the data is expired time
        if (serializedData.createdAt + ttl < now) {
            return valueIfNotExisted;
        }

        return this.serializer.deserialize(serializedData.value);
    }

    /**
     *
     * @param {string} key
     * @param {*} value
     * @return {Promise.<void>}
     */
    async set(key, value) {
        let fileName = this.naming.nameFor(this.directory, key);

        this.fs.writeFileSync(fileName, {
            value: this.serializer.serialize(value),
            createdAt: new Date().getTime()
        });
    }

    /**
     *
     * @param key
     * @return {Promise.<void>}
     */
    async unset(key) {
        let fileName   = this.naming.nameFor(this.directory, key);

        // Swallow error. Considering any error as no item
        // in the storage, so the error is a false-positive
        try {
            this.fs.unlinkSync(fileName);
        } catch (error) {
            // Do nothing here, hehe ;)
        }
    }

    async flush() {
        let files = this.fs.readdirSync(this.directory);

        files.forEach(file => {
            if (file.endsWith('.dat')) {
                this.fs.unlinkSync(path.normalize(path.join(this.directory, file)));
            }
        });
    }
}
