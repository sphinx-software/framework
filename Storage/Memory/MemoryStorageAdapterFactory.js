import MemoryStorageAdapter from "./MemoryStorageAdapter";

export default class MemoryStorageAdapterFactory {

    make() {
        return new MemoryStorageAdapter([]);
    }
}
