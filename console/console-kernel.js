const IO        = require('./io');
const Verbosity = require('./verbosity');

class ConsoleKernel {

    constructor(program, container) {
        this.program    = program;
        this.container  = container;
    }

    async register(commandName) {
        let command = await this.container.make(commandName);

        let cmdRegistra = this.program.command(command.name);

        if (command.alias) {
            cmdRegistra.alias(command.as);
        }

        if (command.description) {
            cmdRegistra.description(command.description);
        }

        if (command.options) {
            command.options.forEach( option => cmdRegistra.option(...option));
        }

        if (command.arguments) {
            cmdRegistra.arguments(command.arguments);
        }
        command.context = cmdRegistra;
        command.io      = new IO(new Verbosity(cmdRegistra.parent.verbose || 0));

        cmdRegistra.action( () => {
            command.action(...this.program.args).then(() => process.exit(0)).catch(e => {
                console.error(e);
                process.exit(e.code);
            });
        });
    }

    run(argv) {
        this.program.parse(argv);
        if (this.program.args.length === 0) {
            this.program.help();
        }
    }
}

module.exports = ConsoleKernel;
