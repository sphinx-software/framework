import {validator} from "../decorators";
import {singleton} from "../../MetaInjector/index";

@singleton()
@validator('required')
export default class RequiredValidator {
    async validate(data, field) {
        return data[field] !== '';
    }
}
