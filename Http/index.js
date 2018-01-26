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

        this.container.singleton('http.router', async () => {
            let config = await this.container.make('config');

            return new Router(config.http.router);
        });
    }

    async boot() {
        let kernel = await this.container.make('http.kernel');

        let middlewares = this.fusion.getByManifest('kernelMiddleware');

        for (let index = 0; index < middlewares.length; index++) {
            const Symbol   = middlewares[index];

            let middleware = await this.container.make(Symbol);

            kernel.use(middleware.handle)
        }
    }
}

export function kernelMiddleware(value) {
    return Reflect.metadata('kernelMiddleware', value)
}
