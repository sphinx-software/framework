const StorageAdapter = require('./../storage-adapter');
const path           = require('path');

/**
 *
 */
class FileSystemAdapter extends StorageAdapter {

    /**
     *
     * @param {Serializer} serializer
     * @param {fs} filesystem
     * @param {StorageFileNamingConvention} naming
     */
    constructor(serializer, filesystem, naming) {
        super();
        this.serializer = serializer;
        this.filesystem = filesystem;
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
        let fileName    = this.naming.nameFor(this.directory, key);
        let filesystem  = this.filesystem;

        // Don't reject the error.
        // Considering any error occurred as no data
        let readFilePromise = new Promise(resolve => {
            filesystem.readFile(fileName, (error, result) => {
                resolve(error ? null: result);
            })
        });

        let serializedData = await readFilePromise;

        return serializedData ? this.serializer.deserialize(serializedData) : valueIfNotExisted;
    }

    /**
     *
     * @param {string} key
     * @param {*} value
     * @return {Promise.<void>}
     */
    async set(key, value) {
        let fileName = this.naming.nameFor(this.directory, key);
        let fs       = this.filesystem;

        let serializedData = this.serializer.serialize(value);

        fs.writeFileSync(fileName, serializedData);
    }

    /**
     *
     * @param key
     * @return {Promise.<void>}
     */
    async unset(key) {
        let fileName    = this.naming.nameFor(this.directory, key);
        let filesystem  = this.filesystem;

        // Swallow error. Considering any error as no item
        // in the storage, so the error is a false-positive
        await new Promise((resolve) => {
            filesystem.unlink(fileName, error => {
                if (error) {
                    return resolve();
                }
                resolve();
            });
        });
    }

    /**
     *
     * @return {Promise.<void>}
     */
    async prepare() {
        let filesystem = this.filesystem;
        let directory  = this.directory;

        return await new Promise(function (resolve, reject) {
            filesystem.exists(directory, (error, result) => {
                if (error) {
                    return reject(error);
                }

                return resolve(result);
            });
        });
    }

    async flush() {
        let files = this.filesystem.readdirSync(this.directory);

        files.forEach( file => {
            if (file.endsWith('.dat')) {
                this.filesystem.unlinkSync(path.normalize(path.join(this.directory, file)));
            }
        })

    }
}

module.exports = FileSystemAdapter;
