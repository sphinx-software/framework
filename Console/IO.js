import Verbosity from "./Verbosity";

export default class IO {
    constructor(verbosity) {
        this.verbosity = verbosity;
    }

    async run(callback, verbosity = Verbosity.V) {
        if (this.verbosity.inRange(verbosity)) {
            await callback();
        }
    }
}

