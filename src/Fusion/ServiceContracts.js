/**
 * The universal interface for logger
 *
 * @interface
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
 *
 * @interface
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
 *
 * @interface
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
 *
 * @interface
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
 *
 * @interface
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
 *
 * @interface
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
 *
 * @interface
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
 *
 * @interface
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
 *
 * @interface
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

/**
 * @interface
 */
export class ValidatorInterface {
    async validate(data, field, ...parameters) { }
}

/**
 * The universal interface for translate service
 */
export class TranslatorInterface {

    /**
     *
     * @param {string} locale
     * @return {Promise.<void>}
     */
    locale(locale) {}

    /**
     *
     * @param {string} key
     * @return {Promise.<void>}
     */
    translate(key) {}

}

/**
 * @interface
 */
export class NunjucksViewFilterInterface {

    /**
     * Filter a value and returns it's presentation
     *
     * @param {any} value
     * @param parameters
     * @return string
     */
    run(value, ...parameters) { }
}

/**
 * @interface
 */
export class ViewEngineInterface {

    /**
     *
     * @param {View} view
     * @return {Promise<string>}
     */
    async render(view) { }
}

/**
 * @interface DatabaseConnectionInterface
 */
export class DatabaseConnectionInterface {

    /**
     * Create a new SQL query
     *
     */
    query() { }

    /**
     * Run an SQL query
     *
     * @param query
     * @return {Promise<void>}
     */
    async execute(query) { }

    /**
     * Run a database transaction
     *
     * @param procedure
     * @return {Promise<void>}
     */
    async transaction(procedure) { }

    /**
     * Get the schema builder
     */
    schema() { }
}

/**
 * @interface
 */
export class DatabaseManagerInterface {
    /**
     * Gets a database connection by its name
     *
     * @param {string|null} name The connection name
     * @return {DatabaseConnectionInterface}
     */
    connection(name = null) {

    }

    /**
     * Creates a query against a table
     *
     * @param {string} table
     * @param {string|null} connection
     */
    from(table, connection = null) {

    }
}

/**
 * @interface
 */
export class DiskInterface {

    /**
     *
     * @param {String} fileName
     * @param {'public'|'private'} permission
     * @return {WriteStream}
     */
    createWriteStream(fileName, permission) {}

    /**
     *
     * @param {String} fileName
     * @return {ReadableStream}
     */
    createReadStream(fileName) {}

    /**
     *
     * @param {String} fileName
     * @return {Promise<boolean>}
     */
    exists(fileName) {}

    /**
     *
     * @param {String} fileName
     * @return {Promise<boolean>}
     */
    delete(fileName) {}

}

/**
 * @interface
 */
export class DiskManagerInterface {

    /**
     *
     * @param name
     * @return {DiskInterface}
     */
    disk(name = null) {}
}

export const Config = 'config';

export const HttpKernel = 'http.kernel';

export const HttpRouter = 'http.router';

export const ConsoleKernel = 'console.kernel';

export const SocketKernel = 'socket.kernel';
