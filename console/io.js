const Verbosity = require('./verbosity');

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

module.exports = IO;
