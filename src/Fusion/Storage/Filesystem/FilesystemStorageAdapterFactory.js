import Convention from "./StorageFileNamingConvention";
import Adapter from "./FilesystemStorageAdapter";
import {singleton} from "../../MetaInjector/index";
import {factory} from "../decorators";
import {SerializerInterface} from "../../ServiceContracts";

@singleton(SerializerInterface)
@factory('filesystem')
export default class FilesystemStorageAdapterFactory {

    /**
     *
     * @param {SerializerInterface} serializer
     */
    constructor(serializer) {
        this.serializer = serializer;
    }

    make(config) {
        return new Adapter(
            this.serializer,
            new Convention().setPrefix(config.prefix)
        ).setStorageDirectory(config.directory);
    }
}
