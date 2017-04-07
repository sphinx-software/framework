const knex = require('knex');
const MigrationMakeCommand = require('./migration/migration-make.command');
const MigrationUpCommand = require('./migration/migration-up.command');

exports.register = (container) => {
    container.singleton('database', async () => {
        let config = await container.make('config');

        return knex(config.database);
    });

    container.singleton('command.migration-make', async () => {
        return new MigrationMakeCommand(await container.make('database'), await container.make('config'));
    });

    container.singleton('command.migration-up', async () => {
        return new MigrationUpCommand(await container.make('database'), await container.make('config'));
    });

};

exports.boot = async (container) => {
    let consoleKernel = await container.make('console.kernel');

    await consoleKernel.register('command.migration-make');
    await consoleKernel.register('command.migration-up');
};
