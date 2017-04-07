const chalk = require('chalk');

class MigrationMakeCommand {

    constructor(database, config) {
        this.database    = database;
        this.config      = config;
    }

    get name() {
        return 'migration-make';
    }

    get description() {
        return 'Generates a migration file';
    }

    get arguments() {
        return '<migration-name>'
    }

    get options() {
        return [
            ['-n, --connection <connection-name>',  'the connection name. If no connection was specified, ' +
                                                    'the default connection will be used'                       ],
            ['-c, --create <table-name>', 'specify migration as creating a table'                               ],
            ['-t, --table <table-name>', 'specify migration as altering a table'                                ],
        ];
    }

    async action(migrationName) {
        await this.io.run(() => console.log(chalk.green('generating migration for'), chalk.yellow(migrationName)));

        await this.io.run(
            async() => console.log(
                chalk.yellow(await this.database.migrate.make(migrationName, this.config.database.migration))
            )
        );
    }
}

module.exports = MigrationMakeCommand;
