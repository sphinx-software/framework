
/**
 * The ConsoleKernel for console application, wrapper of "tj/commander".
 * @see https://github.com/tj/commander.js
 * Thanks TJ for your amazing library ;)
 */
export default class ConsoleKernel {

    /**
     *
     * @param commander
     */
    constructor(commander) {
        this.commander  = commander;
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
     * @param commandRegistra
     * @param command
     */
    decorateOptions(commandRegistra, command) {

        let optionProperties = Object
            .getOwnPropertyNames(command)
            .filter(propertyName => Reflect.hasMetadata('console.command.option', command, propertyName))
        ;

        optionProperties.forEach(optionName => {
            let optionMetadata = Reflect.getMetadata('console.command.option', command, optionName);

            commandRegistra.option(
                optionMetadata.name,
                optionMetadata.description,
                optionValue => command[optionName] = optionMetadata.formatter(optionValue)
            )
        });
    }

    /**
     *
     * @param commandRegistra
     * @param command
     */
    decorateArguments(commandRegistra, command) {
        if(Reflect.hasMetadata('console.command.argument', command, 'action')) {
            commandRegistra.arguments(Reflect.getMetadata('console.command.argument', command, 'action'));
        }
    }

    /**
     *
     * @param {Container} container
     * @param {Function} Command
     * @return {Promise<void>}
     */
    async registerCommand(container, Command) {
        let commandMetadata = Reflect.getMetadata('console.command', Command);
        let commandRegistra = this.commander.command(commandMetadata.name);

        commandRegistra.description(commandMetadata.description);

        let command = await container.make(Command);

        this.decorateOptions(commandRegistra, command);
        this.decorateArguments(commandRegistra, command);

        commandRegistra.action(() => {
            this.executedCommand = true;
            this.commandPromise  = command.action(...this.commander.args)
        });
    }
}
