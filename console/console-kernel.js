class ConsoleKernel {

    constructor(program, container) {
        this.program    = program;
        this.container  = container;
    }

    async register(commandName) {
        let command = await this.container.make(commandName);

        command.register(this.program).action((cmd, options) => command.action(command, options));
    }

    run() {
        return this.program.parse(process.argv);
    }
}

module.exports = ConsoleKernel;
