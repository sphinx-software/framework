import lodash from "lodash";

export default class FormValidationResult {
    constructor(results) {
        this.results = results;
    }

    /**
     * Get back the form value
     *
     * @param fieldName
     * @return {Object|*}
     */
    value(fieldName = null) {
        if (!fieldName) {
            return lodash.mapValues(this.results.fields, fieldResult => fieldResult.value);
        }
        if (!this.results.fields[fieldName]) {
            throw new Error(`E_RULES: Validation rules for field [${fieldName}] is not specified`);
        }

        return this.results.fields[fieldName].value;
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
     * Get the detail validation result of a given field
     *
     * @param fieldName
     * @param rule
     * @return {FormValidationResult.details|any}
     */
    details(fieldName, rule = null) {
        if (!this.results.fields[fieldName]) {
            throw new Error(`E_RULES: Validation rules for field [${fieldName}] is not specified`);
        }

        if (!rule) {
            return this.results.fields[fieldName].details;
        }

        let detail = this.results.fields[fieldName].details.find(detail => detail.validatorName === rule);

        if (!detail) {
            throw new Error(`E_RULES: Validation rule [${rule}] is not applied for field [${fieldName}]`);
        }

        return detail;
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
                fields.push(fieldName);
            }
        });

        return fields;
    }

    /**
     *
     * @return {{}}
     */
    toJson() {
        return this.results;
    }
}
