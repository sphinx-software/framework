import lodash from 'lodash';

/**
 * Okay, don't be confused by its name.
 * There is an amazing library called "validator" written by Chris O'Hara
 * @link https://github.com/chriso/validator.js
 *
 * The library somehow works so well with my (Rikky) design concept.
 * So instead of writing each validator manually, I'll borrow his library and wrap it into this class.
 *
 * Many thanks to Chris, your library is awesome!!!
 *
 * A "validator" wrapper Validator
 */
export default class ChrisOHaraValidatorValidator {
    constructor(validatorMethodOfChrisOhara) {
        this.method = validatorMethodOfChrisOhara;
    }

    async validate(data, field, ...parameters) {

        // Since the "validator" library works with string only.
        // So if data[field] is not a string, we'll consider it as an invalid case.
        if (!lodash.isString(data[field])) {
            return false;
        }

        return this.method(data[field], ...parameters);
    }
}
