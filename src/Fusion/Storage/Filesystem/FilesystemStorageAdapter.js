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
     * @param {string} key
     * @param {*} valueIfNotExisted
     * @param {Object} options
     * @return {Promise.<*>}
     */
    async get(key, valueIfNotExisted = null, options = {}) {
        let now = new Date().getTime();
        let fileName   = this.naming.nameFor(this.directory, key);

        // Don't reject the error.
        // Considering any error occurred as no data
        let serializedData = null;
        try {
            serializedData = this.fs.readFileSync(fileName);
        } catch (error) {
            serializedData = null;
        }

        // When the data is expired time
        if (options.ttl && (serializedData.created_at + options.ttl < now)) {
            serializedData = null;
        }

        if (!serializedData) return valueIfNotExisted;

        return  this.serializer.deserialize(serializedData.value)
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
            created_at: new Date().getTime()
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
