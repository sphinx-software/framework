class View {

    constructor(template, data) {
        this.template = template;
        this.data     = data;
    }

    bind(variableName, value) {
        this.data[variableName] = value;
        return this;
    }

    getTemplate() {
        return this.template;
    }

    getData() {
        return this.data;
    }
}

module.exports = View;
