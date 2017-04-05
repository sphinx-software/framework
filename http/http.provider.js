const Koa    = require('koa');
const Router = require('koa-router');

exports.register = function (container) {
    container.singleton('http.kernel', async () => {
        let app = new Koa();

        return app.use(async (ctx, next) => {
            ctx.container = container;
            await next();
        });
    });

    container.singleton('http.router', async () => {
        let config = await container.make('config');

        return new Router(config.http.router)
    });
};

exports.boot = async (container) => {
    let kernel = await container.make('http.kernel');
    let router = await container.make('http.router');

    let config = await container.make('config');

    config.http.middlewares.forEach((middleware) => kernel.use(middleware));
};
