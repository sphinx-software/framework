class Verbosity {
    constructor(level) {
        this.level = level;
    }

    inRange(range) {
        return this.level >= range;
    }

    /**
     * @return {number}
     */
    static get VVV() {
        return 2;
    }

    /**
     * @return {number}
     */
    static get VV() {
        return 1;
    }

    /**
     * @return {number}
     */
    static get V() {
        return 0;
    }

}

module.exports = Verbosity;