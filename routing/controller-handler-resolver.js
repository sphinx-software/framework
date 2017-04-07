const VError = require('verror');

class ControllerHandlerResolver {

    constructor(container) {
        this.container = container;
    }

    resolve(spec) {
        let segments = spec.split('.');

        if (segments.length !== 2) {
            throw new VError('E_ROUTING: Invalid routing spec [%s]', spec);
        }

        let controllerName  = segments[0];
        let actionName      = segments[1];

        return async (context, next) => {
            let controller = await this.container.make(controllerName);

            return await controller[actionName](context, next);
        };
    }
}

module.exports = ControllerHandlerResolver;
