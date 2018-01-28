import NullStorageAdapter from "./NullStorageAdapter";

export default class NullStorageAdapterFactory {
    make() {
        return new NullStorageAdapter();
    }
}
