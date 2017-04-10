const VError = require('verror');

class TransportManager {

    /**
     *
     * @param transports
     */
    constructor(transports = {}) {
        this.transports = transports;
        this.default    = null;
    }

    /**
     *
     * @param {string} name
     * @param {transport|LogTransport} transport
     * @return {TransportManager}
     */
    addTransport(name, transport) {
        this.transports[name] = transport;
        return this;
    }

    /**
     *
     * @param name
     * @return {TransportManager}
     */
    setDefaultTransport(name) {
        this.default = name;
        return this;
    }

    /**
     *
     * @param name
     * @return {transport}
     */
    transport(name) {
        name = name || this.default;

        let transport = this.transports[name];

        if (!transport) {
            throw new VError('E_MAIL_TRANSPORT: Transport [%s] is not supported', name);
        }

        return transport;
    }
}

module.exports = TransportManager;
