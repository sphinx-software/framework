const chalk = require('chalk');

/**
 * Rollback Migration Command
 */
class MigrationRollbackCommand {

    constructor(database, config) {
        this.database    = database;
        this.config      = config;
    }

    get name() {
        return 'migration-down';
    }

    get description() {
        return 'Rollbacks database migrations';
    }

    get options() {
        return [
            ['-n, --connection <connection-name>',  'the connection name. If no connection was specified, ' +
            'the default connection will be used'                       ],
        ];
    }

    async action() {
        let config = this.config.database.migration;

        await this.io.run(() => console.log(chalk.green('rolling back migrations')));
        await this.database.migrate.rollback(config);
        await this.io.run(() => console.log(chalk.green('done')));
    }
}

module.exports = MigrationRollbackCommand;
