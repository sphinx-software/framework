class LogTransport {

    constructor(logger) {
        this.logger = logger;
    }

    async sendMail(mailOptions) {
        this.logger.debug('A mail was sent via log service', mailOptions);
    }
}

module.exports = LogTransport;