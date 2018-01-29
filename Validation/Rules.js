import lodash from 'lodash';
import Promise from 'bluebird';

/**
 *
 */
export default class Rules {

    results = {};

    /**
     *
     * @param rules
     */
    constructor(rules) {
        this.rules = rules;
    }

    /**
     *
     */
    reset() {
        this.results = {};
    }

    /**
     *
     * @param {*} data
     * @return {Promise<void>}
     */
    async apply(data) {

        let validatePromises = lodash.mapValues(this.rules, async (fieldRules, fieldName) => {
            return await Promise.all(fieldRules.map(async rule => {
                return {
                    validatorName: rule.validatorName,
                    validationValue: data[fieldName],
                    validatorParameters: rule.parameters,
                    validity: await rule.validator.validate(data, fieldName, ...rule.parameters)
                }
            })).then(fieldResult => {
                return {
                    validity: fieldResult.filter(result => !result.validity).length === 0,
                    details: fieldResult,
                    valids: fieldResult.filter(result => result.validity).map(result => result.validatorName),
                    invalids: fieldResult.filter(result => !result.validity).map(result => result.validatorName)
                }
            });
        });

        this.results.fields   = await Promise.props(validatePromises);
        this.results.validity = lodash.values(this.results.fields).filter(fieldResult => !fieldResult.validity).length === 0;
    }

    /**
     * Check if the data (or the data's field) is valid
     *
     * @param fieldName
     * @return {*|boolean|ValidityState}
     */
    valid(fieldName = null) {
        if (!fieldName) {
            return this.results.validity;
        }
        if (!this.results.fields[fieldName]) {
            throw new Error(`E_RULES: Validation rules for field [${fieldName}] is not specified`);
        }
        return this.results.fields[fieldName].validity;
    }

    /**
     * Check if the data (or the data's field) is invalid
     *
     * @param fieldName
     */
    invalid(fieldName = null) {
        return !this.valid(fieldName);
    }

    /**
     * Get the invalid reasons of the data (or the data's field)
     *
     * @param fieldName
     * @return {*}
     */
    reasons(fieldName = null) {
        if (!fieldName) {
            let reasons = [];

            lodash.forIn(this.results.fields, (fieldResult, field) => {
                if (!fieldResult.validity) {
                    reasons.push({field: field, reasons: fieldResult.invalids});
                }
            });

            return reasons;
        }

        if (!this.results.fields[fieldName]) {
            throw new Error(`E_RULES: Validation rules for field [${fieldName}] is not specified`);
        }

        return this.results.fields[fieldName].invalids;
    }

    /**
     * Get all of the valid fields
     *
     * @return {Array}
     */
    validFields() {
        let fields = [];

        lodash.forIn(this.results.fields, (fieldResult, fieldName) => {
            if (fieldResult.validity) {
                fields.push(fieldName)
            }
        });

        return fields;
    }

    /**
     * Get all of the invalid fields
     *
     * @return {Array}
     */
    invalidFields() {
        let fields = [];

        lodash.forIn(this.results.fields, (fieldResult, fieldName) => {
            if (!fieldResult.validity) {
                fields.push(fieldName)
            }
        });

        return fields;
    }

    /**
     * Get the validation results
     *
     * @return {{}}
     */
    getResults() {
        return this.results;
    }

    /**
     *
     * @return {{}}
     */
    toJson() {
        return this.getResults();
    }
}

