import program from 'commander';
import fs from 'fs';
import {provider} from "../Fusion/Fusion";
import {ConsoleKernel} from "../Fusion/ServiceContracts";

class Verbosity {
    constructor(level) {
        this.level = level;
    }

    inRange(range) {
        return this.level >= range;
    }

    /**
     * @return {number}
     */
    static get VVV() {
        return 2;
    }

    /**
     * @return {number}
     */
    static get VV() {
        return 1;
    }

    /**
     * @return {number}
     */
    static get V() {
        return 0;
    }

}


class IO {
    constructor(verbosity) {
        this.verbosity = verbosity;
    }

    async run(callback, verbosity = Verbosity.V) {
        if (this.verbosity.inRange(verbosity)) {
            await callback();
        }
    }
}

@provider()
export default class ConsoleServiceProvider {

    constructor(container, fusion) {
        this.container = container;
        this.fusion    = fusion;
    }

    register() {
        this.container.value(
            ConsoleKernel,
            program
                .version(fs.readFileSync(__dirname + '/header.txt', {encoding: 'utf-8'}))
                .option('-v, --verbose', 'set the output verbosity', (v, total) => total + 1, 0)
        );
    }

    async boot() {
        let commands = this.fusion.getByManifest('console.command');
        let kernel   = await this.container.make(ConsoleKernel);

        for (let index = 0; index < commands.length; index++) {
            await this.appendCommand(kernel, commands[index]);
        }
    }

    async appendCommand(kernel, Command) {

        let commandMetadata = Reflect.getMetadata('console.command', Command);
        let commandRegistra = kernel.command(commandMetadata.name);

        commandRegistra.description(commandMetadata.description);

        if (Reflect.hasMetadata('console.command.options', Command)) {
            Reflect.getMetadata('console.command.options', Command).forEach(option => commandRegistra.option(...option))
        }

        if (Reflect.hasMetadata('console.command.arguments', Command)) {
            commandRegistra.arguments(Reflect.getMetadata('console.command.arguments', Command));
        }

        let command = await this.container.make(Command);

        command.context = commandRegistra;
        command.io      = new IO(new Verbosity(commandRegistra.parent.verbose || 0));


        commandRegistra.action(() => {
            command.action(...kernel.args).then(() => process.exit(0)).catch(e => {
                console.error(e);
                process.exit(e.code);
            });
        })
    }
}


export function command(name, description = '') {
    return Reflect.metadata('console.command', {name: name, description: description});
}

export function args(args) {
    return Reflect.metadata('console.command.arguments', args);
}

export function options(...options) {
    return Reflect.metadata('console.command.options', options);
}