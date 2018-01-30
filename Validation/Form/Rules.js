import lodash from 'lodash';
import Promise from 'bluebird';
import FormValidationResult from "./FormValidationResult";

/**
 * Represent a form rules
 */
export default class Rules {

    /**
     *
     * @param rules
     */
    constructor(rules) {
        this.rules = rules;
    }

    /**
     *
     * @param {*} data
     * @return {Promise<FormValidationResult>}
     */
    async apply(data) {

        let results = {};

        let validatePromises = lodash.mapValues(this.rules, async (fieldRules, fieldName) => {
            return await Promise.all(fieldRules.map(async rule => {
                return {
                    validatorName: rule.validatorName,
                    value: data[fieldName],
                    validatorParameters: rule.parameters,
                    validity: await rule.validator.validate(data, fieldName, ...rule.parameters)
                }
            })).then(fieldResult => {
                return {
                    value: data[fieldName],
                    validity: fieldResult.filter(result => !result.validity).length === 0,
                    details: fieldResult,
                    valids: fieldResult.filter(result => result.validity).map(result => result.validatorName),
                    invalids: fieldResult.filter(result => !result.validity).map(result => result.validatorName)
                }
            });
        });

        results.fields   = await Promise.props(validatePromises);
        results.validity = lodash.values(results.fields).filter(fieldResult => !fieldResult.validity).length === 0;

        return new FormValidationResult(results);
    }
}

