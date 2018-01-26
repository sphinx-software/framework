import Koa from 'koa';
import Router from 'koa-router';
import {provider} from "../Fusion/Fusion";

@provider()
export class HttpServiceProvider {

    constructor(container, fusion) {
        this.container = container;
        this.fusion    = fusion;
    }

    register() {
        this.container.singleton('http.kernel', async () => {
            let kernel = new Koa();

            return kernel.use(async (ctx, next) => {
                ctx.container = this.container;
                await next();
            });
        });
    }

    async boot() {
        let kernel = await this.container.make('http.kernel');

        let middlewares = this.fusion.getByManifest('http.kernelMiddleware');

        for (let index = 0; index < middlewares.length; index++) {
            const Symbol   = middlewares[index];

            let middleware = await this.container.make(Symbol);

            kernel.use(middleware.handle)
        }
    }
}

@provider()
export class HttpRouterServiceProvider {
    constructor(container, fusion) {
        this.container = container;
        this.fusion    = fusion;
    }

    register() {
        this.container.singleton('http.router', async () => {
            let config = await this.container.make('config');

            return new Router(config.http.router);
        });
    }

    async boot() {
        let controllers = this.fusion.getByManifest('http.controller');
        let router      = await this.container.make('http.router');

        for (let index = 0; index < controllers.length; index++) {
            await this.bindController(router, controllers[index]);
        }
    }

    async bindController(router, Controller) {
        let controller = await this.container.make(Controller);

        let controllerActionNames = Object.getOwnPropertyNames(Controller.prototype)
            .filter(methodName => Reflect.hasMetadata('http.action', controller, methodName));

        controllerActionNames.forEach(actionName => {
            let metadata = Reflect.getMetadata('http.action', controller, actionName);

            router[metadata.method](`${Controller.name}@${actionName}`, metadata.url, controller[actionName]);
        })

    }
}

export function kernelMiddleware(value) {
    return Reflect.metadata('http.kernelMiddleware', value);
}

export function controller(prefix = '') {
    return Reflect.metadata('http.controller', prefix);
}

export function action(method, url, middlewares = []) {
    return Reflect.metadata('http.action', {
        method      : method,
        url         : url,
        middlewares : middlewares
    });
}

export function get(url, middlewares = []) {
    return Reflect.metadata('http.action', {
        method      : 'get',
        url         : url,
        middlewares : middlewares
    });
}

export function post(url, middlewares = []) {
    return Reflect.metadata('http.action', {
        method      : 'post',
        url         : url,
        middlewares : middlewares
    });
}

export function put(url, middlewares = []) {
    return Reflect.metadata('http.action', {
        method      : 'put',
        url         : url,
        middlewares : middlewares
    });
}

export function del(url, middlewares = []) {
    return Reflect.metadata('http.action', {
        method      : 'del',
        url         : url,
        middlewares : middlewares
    });
}