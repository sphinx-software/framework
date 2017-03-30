const knex = require('knex');

exports.register = async (container) => {
    container.singleton('database', async () => {
        let config = await container.make('config');

        return knex(config.database);
    });
};
