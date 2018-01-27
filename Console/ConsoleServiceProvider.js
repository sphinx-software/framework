import {ConsoleKernel as Kernel} from "../Fusion/ServiceContracts";
import program from "commander";
import fs from "fs";
import {provider} from "../Fusion/Fusion";
import ConsoleKernel from "./ConsoleKernel";

@provider()
export default class ConsoleServiceProvider {

    constructor(container, fusion) {
        this.container = container;
        this.fusion    = fusion;
    }

    register() {
        this.container.singleton(Kernel, async () => {
            let eventEmitter = await this.container.make('events');
            return new ConsoleKernel(
                program
                    .version(fs.readFileSync(__dirname + '/header.txt', {encoding: 'utf-8'}))
                    .option('-v, --verbose', 'set the output verbosity', (v, total) => total + 1, 0),
                eventEmitter
            )
        });
    }

    async boot() {
        let commands = this.fusion.getByManifest('console.command');
        let kernel   = await this.container.make(Kernel);

        await commands.map(Command => kernel.registerCommand(this.container, Command));
    }
}
