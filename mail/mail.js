const lodash = require('lodash');

class Mail {

    /**
     *
     * @param {string} content
     * @param {transport} transportManager
     */
    constructor(content, transportManager) {
        this.content          = content;
        this.transportManager = transportManager;
    }

    setDefaultOptions(options) {
        this.options = options;
    }

    /**
     *
     * @param from
     */
    from(from) {
        this.options.from = from;
    }

    /**
     *
     * @param to
     */
    to(to) {
        this.options.to = to;
    }

    /**
     *
     * @param cc
     */
    cc(cc) {
        this.options.cc = cc;
    }

    /**
     *
     * @param bcc
     */
    bcc(bcc) {
        this.options.bcc = bcc;
    }

    /**
     *
     * @param subject
     */
    subject(subject) {
        this.options.subject = subject;
    }

    /**
     *
     * @param attachments
     */
    attachments(attachments) {
        this.options.attachments = attachments;
    }

    /**
     *
     * @param optionName
     * @param value
     */
    set(optionName, value) {
        this.options[optionName] = value;
    }

    /**
     *
     * @param transporter
     * @return {Promise.<void>}
     */
    async send(transporter = null) {

        let options = lodash.clone(this.options);

        options.html = this.content;

        await this.transportManager.transport(transporter).sendMail(options);
    }
}

module.exports = Mail;
