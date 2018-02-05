import MemoryStorageAdapter from "./MemoryStorageAdapter";
import {singleton} from "../../MetaInjector";
import {factory} from "../decorators";

@singleton()
@factory()
export default class MemoryStorageAdapterFactory {

    make() {
        return new MemoryStorageAdapter([]);
    }
}
