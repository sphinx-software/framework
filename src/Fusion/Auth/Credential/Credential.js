export default class Credential {

    constructor(attributes) {
        this.attributes = attributes;
    }

    getIdentity() {
        return this.attributes
    }
}