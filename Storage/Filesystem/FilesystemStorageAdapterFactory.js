import Convention from "./StorageFileNamingConvention";
import Adapter from "./FilesystemStorageAdapter";

export default class FilesystemStorageAdapterFactory {

    /**
     *
     * @param {SerializerInterface} serializer
     * @return {FilesystemStorageAdapterFactory}
     */
    setSerializer(serializer) {
        this.serializer = serializer;
        return this;
    }

    /**
     *
     * @param { {prefix: String, directory: string} }config
     * @return {FilesystemStorageAdapterFactory}
     */
    setConfig(config) {
        this.config = config;

        return this;
    }

    make() {
        return new Adapter(
            this.serializer,
            new Convention().setPrefix(this.config.prefix)
        ).setStorageDirectory(this.config.directory);
    }
}