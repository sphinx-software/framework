import MemoryStorageAdapter from "./MemoryStorageAdapter";
import {singleton} from "../../MetaInjector/index";
import {factory} from "../decorators";

@singleton()
@factory()
export default class MemoryStorageAdapterFactory {

    make() {
        return new MemoryStorageAdapter([]);
    }
}
