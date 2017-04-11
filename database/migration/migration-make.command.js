const chalk = require('chalk');
const path  = require('path');

/**
 * Make Migration Command
 */
class MigrationMakeCommand {

    constructor(database, config) {
        this.database    = database;
        this.config      = config;
    }

    get name() {
        return 'migration-make';
    }

    get description() {
        return 'Generates a database migration file';
    }

    get arguments() {
        return '<migration-name>'
    }

    get options() {
        return [
            ['-c, --create <table-name>', 'specify migration as creating a table' ],
            ['-t, --table <table-name>', 'specify migration as altering a table'  ],
        ];
    }

    async action(migrationName) {
        let config = this.config.database.migration;

        await this.io.run(() => console.log(chalk.green('generating migration for'), chalk.yellow(migrationName)));

        config.variables = {};

        if (this.context.table) {
            config.stub = path.normalize(path.join(__dirname, 'migration.table.stub'));
            config.variables.tableName = this.context.table;
        } else {
            config.stub = path.normalize(path.join(__dirname, 'migration.create.stub'));
            config.variables.tableName = this.context.create || null;
        }

        await this.io.run(
            async() => console.log(
                chalk.green(await this.database.migrate.make(migrationName, config))
            )
        );
    }
}

module.exports = MigrationMakeCommand;
