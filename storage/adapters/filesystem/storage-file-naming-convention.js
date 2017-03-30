const path = require('path');

class StorageFileNamingConvention {

    /**
     *
     * @param {string} prefix
     * @return {StorageFileNamingConvention}
     */
    setPrefix(prefix) {
        this.prefix = prefix;
        return this;
    }

    /**
     *
     * @param {string} directory
     * @param {string} key
     * @return {string}
     */
    nameFor(directory, key) {
        return path.normalize(path.join(directory, `sphinx--${this.prefix}--${key}.dat`));
    }
}

module.exports = StorageFileNamingConvention;
