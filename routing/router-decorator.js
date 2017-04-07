const lodash = require('lodash');

class RouterDecorator {

    constructor(controllerHandlerResolver) {
        this.controllerHandlerResolver = controllerHandlerResolver;
    }

    decorate(config, router) {
        lodash.each(config, (routeConfig, routeName) => {

            let handlers = routeConfig.handlers.map((spec) => {
                if (lodash.isString(spec)) {
                    return this.controllerHandlerResolver.resolve(spec)
                }
                return spec;
            });

            router[routeConfig.method](routeName, routeConfig.url, ...handlers)
        });
    }
}

module.exports = RouterDecorator;
