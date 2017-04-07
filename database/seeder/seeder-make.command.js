const chalk = require('chalk');
const path  = require('path');

/**
 * Seeder Make Command
 */
class SeederMakeCommand {

    constructor(database, config) {
        this.database    = database;
        this.config      = config;
    }

    get name() {
        return 'seeder-make';
    }

    get arguments() {
        return '<seeder-name>';
    }

    get description() {
        return 'Generates a database seeder file';
    }

    async action(seederName) {
        let config = this.config.database.seed;

        config.stub = path.normalize(path.join(__dirname, 'seeder.stub'));

        await this.io.run(() => console.log(chalk.green('generating seeder file'), chalk.yellow(seederName)));
        await this.io.run(async () => console.log(chalk.green(await this.database.seed.make(seederName, config))));
    }
}

module.exports = SeederMakeCommand;
