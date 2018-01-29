import lodash from "lodash";

export default class Form {

    data            = {};

    result          = null;

    rules           = null;

    rulesDefinition = {};

    /**
     *
     * @param {ValidatorManager} validatorManager
     * @return {Form}
     */
    setManager(validatorManager) {
        this.validatorManager = validatorManager;
        return this;
    }

    /**
     *
     * @param rulesDefinition
     * @return {Form}
     */
    setRulesDefinition(rulesDefinition) {
        this.rulesDefinition = rulesDefinition;
        return this;
    }

    /**
     * @return {*}
     */
    getData() {
        return this.data;
    }

    /**
     * Handles when the request's data is valid
     *
     * @param context
     * @param next
     * @return {Promise<void>}
     */
    async valid(context, next) {
        context.form = this;
        await next();
    }

    /**
     * We highly recommend user to overrides this method
     * Handles when the request's data is invalid
     *
     * @param context
     * @param next
     * @return {Promise<void>}
     */
    async invalid(context, next) {
        context.body = this.result.toJson();
    }

    /**
     * Resolves the form data from the request
     *
     * @param request
     * @return {Object}
     */
    resolveFormData(request) {

        // According to W3C, we'll support more methods for form than just GET, POST
        // But we highly recommend to use those 2 methods only.
        // Otherwise, we'll let the user override this method.
        let data = ['get', 'head'].includes(request.method.toLowerCase()) ? request.query : request.body;

        // Each missing key will be casted into an empty string.
        lodash.keys(this.rulesDefinition).filter(key => !lodash.hasIn(data, key)).map(key => data[key] = '');

        return data;
    }

    /**
     * Handle this http request as an middleware
     *
     * @param context
     * @param next
     * @return {Promise<void>}
     */
    async handle(context, next) {
        this.rules   = this.validatorManager.make(this.rulesDefinition);
        this.data    = this.resolveFormData(context.request);

        this.result  = await this.rules.apply(this.data);

        this.result.valid() ?
            await this.valid(context, next) :
            await this.invalid(context, next);
    }
}
