import {validator} from "../decorators";
import {singleton} from "../../MetaInjector/index";

@singleton()
@validator('length')
export class LengthValidator {
    async validate(data, field, min, max) {

        let $max = parseInt(max);
        let $min = parseInt(min);

        return data[field].length >= $min &&
            data[field].length <= $max
        ;
    }
}

@singleton()
@validator('length.min')
export class MinLengthValidator {
    async validate(data, field, min) {

        let $min = parseInt(min);

        return data[field].length >= $min;
    }
}

@singleton()
@validator('length.max')
export class MaxLengthValidator {
    async validate(data, field, max) {

        let $max = parseInt(max);

        return data[field].length <= $max;
    }
}
