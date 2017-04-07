const chalk = require('chalk');

/**
 * Up Migration Command
 */
class MigrationUpCommand {

    constructor(database, config) {
        this.database    = database;
        this.config      = config;
    }

    get name() {
        return 'migration-up';
    }

    get description() {
        return 'Runs database migrations';
    }

    get options() {
        return [
            ['-n, --connection <connection-name>',  'the connection name. If no connection was specified, ' +
            'the default connection will be used'                       ],
        ];
    }

    async action() {
        let config = this.config.database.migration;

        await this.io.run(() => console.log(chalk.green('running migrations')));
        await this.database.migrate.latest(config);
        await this.io.run(async () => console.log(chalk.green('done')));
    }
}

module.exports = MigrationUpCommand;
