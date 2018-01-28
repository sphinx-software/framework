import Verbosity from "./Verbosity";
import IO from "./IO";

/**
 * The ConsoleKernel for console application, wrapper of "tj/commander".
 * @see https://github.com/tj/commander.js
 * Thanks TJ for your amazing library ;)
 */
export default class ConsoleKernel {

    /**
     *
     * @param commander
     * @param {EventEmitter} eventEmitter
     */
    constructor(commander, eventEmitter) {
        this.commander      = commander;
        this.eventEmitter   = eventEmitter;
    }

    /**
     *
     * @param argv
     * @return {Promise<void | *>}
     */
    async handle(argv) {
        this.executedCommand = false;
        this.commander.parse(argv);

        if (this.commander.args.length === 0) {
            return this.commander.help();
        }

        if (!this.executedCommand) {
            return this.commander.help();
        }

        await this.commandPromise;
    }

    /**
     *
     * @param {Function} handler
     * @return {ConsoleKernel}
     */
    onError(handler) {
        this.eventEmitter.on('console-kernel.error', handler);
        return this;
    }

    /**
     *
     * @param {Container} container
     * @param {{action: Function}} Command
     * @return {Promise<void>}
     */
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
            this.executedCommand = true;
            command.context = commandRegistra;
            command.io      = new IO(new Verbosity(this.commander.verbose || 0));
            this.commandPromise = command
                .action(...this.commander.args)
                .catch( error => this.eventEmitter.emit('console-kernel.error', error, command));
        })
    }
}
