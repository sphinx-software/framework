import winston from 'winston';
import {provider} from "../Fusion/Fusion";
import {LoggerInterface} from "../Fusion/ServiceContracts";

@provider()
export default class LogServiceProvider {
    constructor(container) {
        this.container = container;
    }

    register() {
        this.container.singleton(LoggerInterface, async () => {

            let config = await this.container.make('config');

            return new (winston.Logger)(config.log);
        });
    }
}
