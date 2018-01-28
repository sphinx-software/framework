/**
 * The universal interface for logger
 */
export class LoggerInterface {

    /**
     *
     * @param {string|number}level
     * @param {string} message
     * @param {*} context
     */
    log(level, message, context) { }

    /**
     *
     * @param {string} message
     * @param {*} context
     */
    error(message, context) { }

    /**
     *
     * @param {string} message
     * @param {*} context
     */
    warn(message, context) { }

    /**
     *
     * @param {string} message
     * @param {*} context
     */
    info(message, context) { }

    /**
     *
     * @param {string} message
     * @param {*} context
     */
    verbose(message, context) { }

    /**
     *
     * @param {string} message
     * @param {*} context
     */
    debug(message, context) { }

    /**
     *
     * @param {string} message
     * @param {*} context
     */
    silly(message, context) { }
}

/**
 * The universal interface for storage adapter
 */
export class StorageAdapterInterface {
    /**
     *
     * @param {string} key
     * @param {*} valueIfNotExisted
     * @return {Promise.<*>}
     */
    async get(key, valueIfNotExisted = null) { }

    /**
     *
     * @param {string} key
     * @param {*} value
     * @param {*} options
     * @return {Promise.<void>}
     */
    async set(key, value, options) { }

    /**
     *
     * @param {string} key
     * @return {Promise.<void>}
     */
    async unset(key) { }

    async flush() { }
}

/**
 * The universal interface for storage adapter factory
 */
export class StorageAdapterFactoryInterface {

    /**
     *
     * @param {*} config
     * @return {StorageAdapterInterface}
     */
    make(config) { }
}


/**
 * The universal interface for cache service
 */
export class CacheInterface extends StorageAdapterFactoryInterface {

    /**
     *
     * @param {string} key
     * @param {*} valueIfNotExisted
     * @return {Promise<*>}
     */
    async get(key, valueIfNotExisted = null) { }

    /**
     *
     * @param {string} key
     * @param {*} value
     * @param {*} options
     * @return {Promise<void>}
     */
    async set(key, value, options = {}) { }

    /**
     *
     * @param {string} key
     * @return {Promise<void>}
     */
    async unset(key) { }
}

/**
 * The universal interface for session storage
 */
export class SessionStorageInterface extends StorageAdapterInterface {

    /**
     *
     * @param {string} sessionId
     * @param {*} valueIfNotExisted
     * @return {Promise<Session>}
     */
    async get(sessionId, valueIfNotExisted = null) { }

    /**
     *
     * @param {string} sessionId
     * @param {*} value
     * @param {*} options
     * @return {Promise<void>}
     */
    async set(sessionId, value, options = {}) { }

    /**
     *
     * @param {string} sessionId
     * @return {Promise<void>}
     */
    async unset(sessionId) { }
}

/**
 * The universal interface for hash service
 */
export class HasherInterface {

    /**
     *
     * @param {string} value
     * @return {Promise<string>}
     */
    async generate(value) { }

    /**
     *
     * @param value
     * @param hashed
     * @return {Promise<boolean>}
     */
    async check(value, hashed) { }
}

/**
 * The universal interface for mail service
 */
export class MailerInterface {
    /**
     *
     * @param {string} template
     * @param {*} data
     * @param {Function} factoryFunction
     * @return {Promise<Mail>}
     */
    async compose(template, data, factoryFunction = async () => { }) { }
}

/**
 * The universal interface for view service
 */
export class ViewFactoryInterface {
    /**
     *
     * @param {string} template
     * @param {*} data
     * @return {View}
     */
    make(template, data = {}) { }
}


/**
 * The universal interface for serializer service
 */
export class SerializerInterface {

    /**
     *
     * @param {constructor|string} type the class type that should be serialized or its name
     * @param {function} serializeFunction
     * @param {function} deserializeFunction
     * @return {Serializer}
     */
    forType(type, serializeFunction, deserializeFunction) { }

    /**
     * Do serialize item into data string
     *
     * @param {*} item
     * @return {string}
     */
    serialize(item) { }

    /**
     * Deserialize a data string into its object form
     *
     * @param {string} serializedData
     * @return {*}
     */
    deserialize(serializedData) { }
}

export class DatabaseConnectionInterface {
    // todo
}

export class DatabaseInterface {
    // todo
}

export const Config = 'config';

export const HttpKernel = 'http.kernel';

export const HttpRouter = 'http.router';

export const ConsoleKernel = 'console.kernel';

export const SocketKernel = 'socket.kernel';