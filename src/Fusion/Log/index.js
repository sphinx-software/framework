import winston from 'winston';
import {provider} from "../Fusion";
import {Config, LoggerInterface} from "../ServiceContracts";

@provider()
export default class LogServiceProvider {

    /**
     *
     * @param {Container} container
     */
    constructor(container) {
        this.container = container;
    }

    register() {
        this.container.singleton(LoggerInterface, async () => {

            let config = await this.container.make(Config);

            return new (winston.Logger)(config.log);
        });
    }
}
