import BCryptHasher from './BCryptHasher';
import bcrypt from 'bcrypt';
import {provider} from "../Fusion/Fusion";
import {Config, HasherInterface} from "../Fusion/ServiceContracts";

@provider()
export default class HasherServiceProvider {
    constructor(container) {
        this.container = container;
    }

    register() {
        this.container.singleton(HasherInterface, async () => {
            let config = await this.container.make(Config);

            return new BCryptHasher(bcrypt).setRounds(config.hash.rounds);
        });
    }
}
