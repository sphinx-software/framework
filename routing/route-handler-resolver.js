class RouteHandlerResolver {

    constructor(container) {
        this.container = container;
    }

    resolve(spec) {

        return async() => {
            let segments = spec.split(spec);

        }
    }
}

module.exports = RouteHandlerResolver;
