import TransportManager from 'transport-manager';
import LogTransport from 'log-transport';
import Mailer from 'mailer';
import nodemailer from 'nodemailer';
import lodash from 'lodash';
import {provider} from "../Fusion/Fusion";

@provider()
export class mailProvider {
    constructor(container, fusion) {
        this.container = container;
        this.fusion    = fusion;
    }

    register() {
        this.container.singleton('mailer.transport', async () => {
            let config           = await this.container.make('config');
            let transportManager = new TransportManager();
            let logger            = await this.container.make('log');

            lodash.forIn(config.mail.transports, (transportConfiguration, transportName) => {
                if ('log' === transportConfiguration.service) {
                    transportManager.addTransport(transportName, new LogTransport(logger));
                } else {
                    transportManager.addTransport(transportName, nodemailer.createTransport(transportConfiguration));
                }
            });

            return transportManager.setDefaultTransport(config.mail.default);
        });

        this.container.singleton('mailer', async () => {
            let config = await this.container.make('config');
            return new Mailer(await this.container.make('view'), await this.container.make('mailer.transport'), config.mail.options);
        });
    }
}