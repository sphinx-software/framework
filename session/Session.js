import lodash from 'lodash';

/**
 *
 */
export default class Session {

    /**
     *
     * @param {Serializer} serializer
     */
    constructor(serializer) {
        this.serializer = serializer;
        this.data       = {
            lastActive  : new Date().getTime(),
            items       : {},
            flash       : []
        };
        this.willBeDestroyed = false;
    }

    /**
     * Init back the session with given data
     *
     * @param {{items: {}, flash: Array}} initialData
     * @return {Session}
     */
    init(initialData) {
        this.data = initialData;
        return this;
    }

    /**
     * Renew the session active time
     * @return {Session}
     */
    touch() {
        this.data.lastActive = new Date().getTime();
        return this;
    }

    /**
     * Jsonify the session data
     *
     * @return {{items: {}, flash: Array}}
     */
    toJson() {
        return this.data;
    }

    /**
     * Get a data in the session
     *
     * @param key
     * @param valueIfNotExisted
     * @return {*}
     */
    get(key, valueIfNotExisted = null) {

        if (!this.has(key)) {
            return valueIfNotExisted;
        }

        let fieldData = this.data.items[key];

        if (lodash.includes(this.data.flash, key)) {
            this.unset(key);
            lodash.remove(this.data.flash, item => item === key);
        }

        return this.serializer.deserialize(fieldData);
    }

    /**
     * Set a data into the session
     *
     * @param key
     * @param value
     */
    set(key, value) {
        this.data.items[key] = this.serializer.serialize(value);
    }

    /**
     * Set the data in the session.
     * Once it was get by #get() method, it will be removed
     *
     * @param key
     * @param value
     */
    flash(key, value) {
        this.set(key, value);
        this.data.flash.push(key);
        this.data.flash = lodash.uniq(this.data.flash);
    }

    /**
     * Check if a data is present in the session or not
     *
     * @param key
     * @return {boolean}
     */
    has(key) {
        return lodash.has(this.data.items, key);
    }

    /**
     * Remove a data from the session
     *
     * @param key
     */
    unset(key) {
        delete this.data.items[key];
    }

    /**
     * Raise the destroy flag
     */
    destroy() {
        this.willBeDestroyed = true;
        return this;
    }

    /**
     * Check if this session should be destroy
     *
     * @return {boolean}
     */
    shouldDestroy() {
        return this.willBeDestroyed;
    }

    /**
     * Check if this session is timeout
     *
     * @param {Number} timeout The session's timeout in milisecond
     */
    isTimeout(timeout) {
        return new Date().getTime() > this.data.lastActive + timeout;
    }
}
