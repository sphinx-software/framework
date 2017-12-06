const Mail = require('./mail');

class Mailer {

    constructor(viewFactory, transportManager, mailOptions) {
        this.viewFactory        = viewFactory;
        this.transportManager   = transportManager;
        this.mailOptions        = mailOptions;
    }

    async compose(template, data, factoryFunction = async () => {}) {
        let view = await this.viewFactory.make(template, data);
        let mail = new Mail(await this.viewFactory.render(view), this.transportManager);

        mail.setDefaultOptions(this.mailOptions);

        await (factoryFunction(mail, data));

        return mail;
    }
}

module.exports = Mailer;
