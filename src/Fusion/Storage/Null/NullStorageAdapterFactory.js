import NullStorageAdapter from "./NullStorageAdapter";
import {singleton} from "../../MetaInjector/index";
import {factory} from "../decorators";

@singleton()
@factory()
export default class NullStorageAdapterFactory {
    make() {
        return new NullStorageAdapter();
    }
}
