import path from 'path';
import fs from 'fs';

export default class FileSystemAdapter {

    /**
     *
     * @param {SerializerInterface} serializer
     * @param {StorageFileNamingConvention} naming
     */
    constructor(serializer, naming) {
        this.serializer = serializer;
        this.naming     = naming;
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
     * @return {Promise.<*>}
     */
    async get(key, valueIfNotExisted = null) {
        let fileName   = this.naming.nameFor(this.directory, key);

        // Don't reject the error.
        // Considering any error occurred as no data
        let serializedData = null;
        try {
            serializedData = fs.readFileSync(fileName);
        } catch (error) {
            serializedData = null;
        }

        return serializedData
            ? this.serializer.deserialize(serializedData)
            : valueIfNotExisted;
    }

    /**
     *
     * @param {string} key
     * @param {*} value
     * @return {Promise.<void>}
     */
    async set(key, value) {
        let fileName = this.naming.nameFor(this.directory, key);

        let serializedData = this.serializer.serialize(value);

        fs.writeFileSync(fileName, serializedData);
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
            fs.unlinkSync(fileName);
        } catch (error) {
            // Do nothing here, hehe ;)
        }
    }

    async flush() {
        let files = fs.readdirSync(this.directory);

        files.forEach(file => {
            if (file.endsWith('.dat')) {
                fs.unlinkSync(path.normalize(path.join(this.directory, file)));
            }
        });
    }
}