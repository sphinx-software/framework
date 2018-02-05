export function factory(adapterName) {
    return Reflect.metadata('storage.factory', adapterName);
}
