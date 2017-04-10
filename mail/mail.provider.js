const TransportManager = require('./transport-manager');
const Mailer           = require('./mailer');
const nodemailer       = require('nodemailer');
const lodash           = require('lodash');

exports.register = container => {

    container.singleton('mailer.transport', async () => {
        let config           = await container.make('config');
        let transportManager = new TransportManager();

        lodash.forIn(config.mail.transports, (transportConfiguration, transportName) => {
            transportManager.addTransport(transportName, nodemailer.createTransport(transportConfiguration));
        });

        return transportManager.setDefaultTransport(config.mail.default);
    });

    container.singleton('mailer', async () => {
        let config = await container.make('config');
        return new Mailer(await container.make('view'), await container.make('mailer.transport'), config.mail.options);
    });
};