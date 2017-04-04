const RouterDecorator = require('./router-decorator');
const ControllerResolver = require('./controller-handler-resolver');

exports.register = (container) => {
    container.singleton('http.router.decorator', async () => new RouterDecorator(new ControllerResolver(container)))
};

exports.boot = async (container) => {
    let routerDecorator = await container.make('http.router.decorator');
    let config          = await container.make('config');

    routerDecorator.decorate(config.routes, await container.make('http.router'));
};
