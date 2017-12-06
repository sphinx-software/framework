const chalk = require('chalk');
const path  = require('path');

/**
 * Seeder Run Command
 */
class SeederRunCommand {

    constructor(database, config) {
        this.database    = database;
        this.config      = config;
    }

    get name() {
        return 'seeder-run';
    }

    get description() {
        return 'Seeds the database';
    }

    async action() {
        await this.io.run(() => console.log(chalk.green('running database seeders')));
        await this.database.seed.run(this.config.database.seed);
        await this.io.run(() => console.log(chalk.green('done')));
    }
}

module.exports = SeederRunCommand;
