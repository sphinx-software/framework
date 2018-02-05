import TransportManager from './TransportManager';
import LogTransport from './LogTransport';
import Mailer from './Mailer';
import nodemailer from 'nodemailer';
import lodash from 'lodash';
import {provider} from "../Fusion";
import {Config, LoggerInterface, MailerInterface, ViewFactoryInterface} from "../ServiceContracts";

@provider()
export default class MailProvider {

    /**
     *
     * @param container
     */
    constructor(container) {
        this.container = container;
    }

    /**
     *
     */
    register() {
        this.container.singleton('mailer.transport', async () => {
            let config           = await this.container.make(Config);
            let transportManager = new TransportManager();
            let logger           = await this.container.make(LoggerInterface);

            lodash.forIn(config.mail.transports, (transportConfiguration, transportName) => {
                if ('log' === transportConfiguration.service) {
                    transportManager.addTransport(transportName, new LogTransport(logger));
                } else {
                    transportManager.addTransport(transportName, nodemailer.createTransport(transportConfiguration));
                }
            });

            return transportManager.setDefaultTransport(config.mail.default);
        });

        this.container.singleton(MailerInterface, async () => {
            let config = await this.container.make(Config);
            return new Mailer(
                await this.container.make(ViewFactoryInterface),
                await this.container.make('mailer.transport'),
                config.mail.options
            );
        });
    }
}