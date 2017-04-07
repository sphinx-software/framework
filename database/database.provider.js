const knex = require('knex');

const MigrationMakeCommand      = require('./migration/migration-make.command');
const MigrationUpCommand        = require('./migration/migration-up.command');
const MigrationRollbackCommand  = require('./migration/migration-rollback.command');

const SeederMakeCommand         = require('./seeder/seeder-make.command');
const SeederRunCommand          = require('./seeder/seeder-run.command');

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

    container.singleton('command.migration-rollback', async () => {
        return new MigrationRollbackCommand(await container.make('database'), await container.make('config'));
    });

    container.singleton('command.seeder-make', async () => {
        return new SeederMakeCommand(await container.make('database'), await container.make('config'));
    });

    container.singleton('command.seeder-run', async () => {
        return new SeederRunCommand(await container.make('database'), await container.make('config'));
    });

};

exports.boot = async (container) => {
    let consoleKernel = await container.make('console.kernel');

    await consoleKernel.register('command.migration-make');
    await consoleKernel.register('command.migration-up');
    await consoleKernel.register('command.migration-rollback');

    await consoleKernel.register('command.seeder-make');
    await consoleKernel.register('command.seeder-run');
};
