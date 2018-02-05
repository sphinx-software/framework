export default class LogTransport {

    /**
     *
     * @param {LoggerInterface} logger
     */
    constructor(logger) {
        this.logger = logger;
    }

    async sendMail(mailOptions) {
        this.logger.debug('A mail was sent via log service', mailOptions);
    }
}
