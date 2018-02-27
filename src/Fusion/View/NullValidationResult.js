export default class NullValidationResult {

    /**
     * Get back the form value
     *
     * @param fieldName
     * @return {Object|*}
     */
    value(fieldName = null) {
        return null;
    }

    /**
     * Check if the data (or the data's field) is valid
     *
     * @param fieldName
     * @return {*|boolean|ValidityState}
     */
    valid(fieldName = null) {
        return true;
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
        return fieldName ? [] : {} ;
    }

    /**
     * Get the detail validation result of a given field
     *
     * @param fieldName
     * @param rule
     * @return {FormValidationResult.details|any}
     */
    details(fieldName, rule = null) {
        return {};
    }

    /**
     * Get all of the valid fields
     *
     * @return {Array}
     */
    validFields() {
        return [];
    }

    /**
     * Get all of the invalid fields
     *
     * @return {Array}
     */
    invalidFields() {
        return []
    }

    /**
     *
     * @return {{}}
     */
    toJson() {
        return {};
    }
}