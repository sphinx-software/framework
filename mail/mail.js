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
        return this;
    }

    /**
     *
     * @param to
     */
    to(to) {
        this.options.to = to;
        return this;
    }

    /**
     *
     * @param cc
     */
    cc(cc) {
        this.options.cc = cc;
        return this;
    }

    /**
     *
     * @param bcc
     */
    bcc(bcc) {
        this.options.bcc = bcc;
        return this;
    }

    /**
     *
     * @param subject
     */
    subject(subject) {
        this.options.subject = subject;
        return this;
    }

    /**
     *
     * @param attachments
     */
    attachments(attachments) {
        this.options.attachments = attachments;
        return this;
    }

    /**
     *
     * @param optionName
     * @param value
     */
    set(optionName, value) {
        this.options[optionName] = value;
        return this;
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
