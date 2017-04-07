class ConsoleKernel {

    constructor(program, container) {
        this.program    = program;
        this.container  = container;
    }

    async register(commandName) {
        let command = await this.container.make(commandName);

        let cmdRegistra = this.program.command(command.name);

        if (command.alias) {
            cmdRegistra.alias(command.as)
        }

        if (command.description) {
            cmdRegistra.description(command.description);
        }

        if (command.options) {
            command.options.forEach( option => cmdRegistra.option(...option));
        }

        cmdRegistra.action( (cmd, options) => command.action(cmd, options));
    }

    run(argv) {
        this.program.parse(argv);
        if (this.program.args.length === 0) {
            this.program.help();
        }
    }
}

module.exports = ConsoleKernel;
