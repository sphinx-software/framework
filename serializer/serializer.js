const VError = require('verror');
const lodash = require('lodash');

/**
 * Strategy based serializer
 */
class Serializer {

    /**
     *
     */
    constructor() {
        this.types      = {};
        this.default    = null;
    }

    /**
     *
     * @param {constructor|string} type the class type that should be serialized or its name
     * @param {function} serializeFunction
     * @param {function} deserializeFunction
     * @return {Serializer}
     */
    forType(type, serializeFunction, deserializeFunction) {
        this.types[Serializer.getTypeNameFromType(type)] = {
            serialize: serializeFunction,
            deserialize: deserializeFunction,
            type: Serializer.getTypeNameFromType(type)
        };

        return this;
    }

    /**
     * Set the default strategy
     *
     * @param defaultType
     * @return {Serializer}
     */
    useDefault(defaultType) {
        this.default = Serializer.getTypeNameFromType(defaultType);

        return this;
    }

    /**
     * Get serialize strategy
     *
     * @param {string} type
     * @return {*}
     */
    getSerializeStrategy(type) {
        let strategy = this.types[type] || this.types[this.default];

        if (!strategy) {
            throw new VError('E_SERIALIZER: Strategy for type [%s] is not supported', type);
        }

        return strategy;
    }

    /**
     *
     * @param {string} type
     * @return {*}
     */
    static getTypeNameFromType(type) {
        return lodash.isFunction(type) ? type.name : type.toString();
    }

    /**
     * Do serialize item into data string
     *
     * @param {*} item
     * @return {string}
     */
    serialize(item) {

        if (lodash.isNull(item)) {
            throw new VError('E_SERIALIZER: Could not serialize [null] value')
        }

        if (lodash.isUndefined(item)) {
            throw new VError('E_SERIALIZER: Could not serialize [undefined] value')
        }

        let type     = item.constructor.name;
        let strategy = this.getSerializeStrategy(type);

        return JSON.stringify({
            type: strategy.type,
            data: strategy.serialize(item)
        });
    }

    /**
     * Deserialize a data string into its object form
     *
     * @param {string} serializedData
     * @return {*}
     */
    deserialize(serializedData) {

        let metadata = null;

        try {
            metadata = JSON.parse(serializedData);
        } catch (error) {
            throw new VError(error, 'E_SERIALIZER: Could not deserialize data');
        }

        if (!metadata.type) {
            throw new VError(
                new VError('E_SERIALIZER: Missing [type] field in metadata'),
                'E_SERIALIZER: Could not deserialize data'
            );
        }

        if (!metadata.data) {
            throw new VError(
                new VError('E_SERIALIZER: Missing [data] field in metadata'),
                'E_SERIALIZER: Could not deserialize data'
            );
        }

        let serializeStrategy = this.getSerializeStrategy(metadata.type);

        return serializeStrategy.deserialize(metadata.data);
    }
}

module.exports = Serializer;
