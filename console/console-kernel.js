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

    run() {
        return this.program.parse(process.argv);
    }
}

module.exports = ConsoleKernel;
