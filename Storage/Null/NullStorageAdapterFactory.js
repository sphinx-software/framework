import NullStorageAdapter from "./NullStorageAdapter";
import {singleton} from "../../MetaInjector";
import {factory} from "../decorators";

@singleton()
@factory()
export default class NullStorageAdapterFactory {
    make() {
        return new NullStorageAdapter();
    }
}
