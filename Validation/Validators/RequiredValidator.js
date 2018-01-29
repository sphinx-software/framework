import {validator} from "../decorators";

@validator('required')
export default class RequiredValidator {
    async validate(data, field) {
        return data[field] !== '';
    }
}
