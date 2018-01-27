import Verbosity from "./Verbosity";
import IO from "./IO";

export default class ConsoleKernel {
    constructor(commander, eventEmitter) {
        this.commander      = commander;
        this.eventEmitter   = eventEmitter;
    }

    handle(argv) {
        this.commander.parse(argv);

        if (this.commander.args.length === 0) {
            this.commander.help();
        }
    }

    onError(handler) {
        this.eventEmitter.on('console-kernel.error', handler);
        return this;
    }

    async registerCommand(container, Command) {
        let commandMetadata = Reflect.getMetadata('console.command', Command);
        let commandRegistra = this.commander.command(commandMetadata.name);

        commandRegistra.description(commandMetadata.description);

        if (Reflect.hasMetadata('console.command.options', Command)) {
            Reflect.getMetadata('console.command.options', Command).forEach(option => commandRegistra.option(...option))
        }

        if (Reflect.hasMetadata('console.command.arguments', Command)) {
            commandRegistra.arguments(Reflect.getMetadata('console.command.arguments', Command));
        }

        let command = await container.make(Command);

        commandRegistra.action(() => {
            command.context = commandRegistra;
            command.io = new IO(new Verbosity(this.commander.verbose || 0));
            command
                .action(...this.commander.args)
                .catch( error => this.eventEmitter.emit('console-kernel.error', error, command));
        })
    }
}
