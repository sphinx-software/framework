import winston from 'winston';
import {provider} from "../Fusion/Fusion";
import {Config, LoggerInterface} from "../Fusion/ServiceContracts";

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
