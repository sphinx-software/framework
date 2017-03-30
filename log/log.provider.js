const winston = require('winston');

exports.register = (container) => {
    container.singleton('log', async () => {

        let config = await container.make('config');

        return new (winston.Logger)(config.log);
    });
};
