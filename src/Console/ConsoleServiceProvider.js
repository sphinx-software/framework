import {ConsoleKernel as Kernel} from "../Fusion/ServiceContracts";
import program from "commander";
import {provider} from "../Fusion/Fusion";
import ConsoleKernel from "./ConsoleKernel";
import packageJson from "../../package";
import chalk from "chalk";

@provider()
export default class ConsoleServiceProvider {

    /**
     *
     * @param {Container} container
     * @param {Fusion} fusion
     */
    constructor(container, fusion) {
        this.container = container;
        this.fusion    = fusion;
    }

    /**
     *
     */
    register() {

        this.container.value(Kernel, new ConsoleKernel(
            program
                .version(
                    `Fusion framework ${chalk.yellow('v' + packageJson.version)}\n` +
                    chalk.gray(`a product of Sphinx Software™, ${new Date().getFullYear()}`))
                .option('-v, --verbose', 'set the output verbosity', (v, total) => total + 1, 0)
        ));
    }

    /**
     *
     * @return {Promise<void>}
     */
    async boot() {
        let commands = this.fusion.getByManifest('console.command');
        let kernel   = await this.container.make(Kernel);

        await Promise.all(commands.map(Command => kernel.registerCommand(this.container, Command)));
    }
}
