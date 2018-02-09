export default class Credential {

    constructor(raw) {
        this.raw = raw;
    }

    getIdentity() {
        return this.raw
    }
}