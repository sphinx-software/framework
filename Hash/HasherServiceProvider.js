import BCryptHasher from './BCryptHasher';
import bcrypt from 'bcrypt';
import {provider} from "../Fusion/Fusion";

@provider()
export default class HasherServiceProvider {
    constructor(container) {
        this.container = container;
    }

    register() {
        this.container.singleton('hash', async () => {
            let config = await this.container.make('config');

            return new BCryptHasher(bcrypt).setRounds(config.hash.rounds);
        });
    }
}
