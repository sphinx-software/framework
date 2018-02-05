import Mail from './Mail';

export default class Mailer {

    /**
     *
     * @param {ViewFactoryInterface} viewFactory
     * @param {TransportManager} transportManager
     * @param mailOptions
     */
    constructor(viewFactory, transportManager, mailOptions) {
        this.viewFactory        = viewFactory;
        this.transportManager   = transportManager;
        this.mailOptions        = mailOptions;
    }

    /**
     *
     * @param {string} template
     * @param {*} data
     * @param {Function} factoryFunction
     * @return {Promise<Mail>}
     */
    async compose(template, data, factoryFunction = async () => {}) {
        let view = await this.viewFactory.make(template, data);
        let mail = new Mail(await this.viewFactory.render(view), this.transportManager);

        mail.setDefaultOptions(this.mailOptions);

        await (factoryFunction(mail, data));

        return mail;
    }
}
