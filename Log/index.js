import winston from 'winston';
import {provider} from "../Fusion/Fusion";

@provider()
export default class LogServiceProvider {
    constructor(container) {
        this.container = container;
    }

    register() {
        this.container.singleton('logger', async () => {

            let config = await this.container.make('config');

            return new (winston.Logger)(config.log);
        });
    }
}
