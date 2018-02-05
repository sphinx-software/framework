import {Config, HttpKernel} from "../ServiceContracts";
import Koa from "koa";
import lodash from 'lodash';
import {provider} from "../Fusion";

@provider()
export default class HttpServiceProvider {

    constructor(container, fusion) {
        this.container = container;
        this.fusion    = fusion;
    }

    register() {
        this.container.singleton(HttpKernel, async () => {
            let kernel = new Koa();

            return kernel.use(async (ctx, next) => {
                ctx.container = this.container;
                await next();
            });
        });
    }

    async boot() {
        let kernel = await this.container.make(HttpKernel);
        let config = await this.container.make(Config);

        config.http.middlewares.forEach(middleware => {
            if (middleware.prototype && lodash.isFunction(middleware.prototype.handle)) {
                this.container.make(middleware).then(realMiddleware => {
                    kernel.use( (context, next) => realMiddleware.handle(context, next));
                })
            } else {
                kernel.use(middleware);
            }
        });

        let middlewares = this.fusion.getByManifest('http.kernelMiddleware');

        for (let index = 0; index < middlewares.length; index++) {
            const Symbol   = middlewares[index];

            let middleware = await this.container.make(Symbol);

            kernel.use( (context, next) => middleware.handle(context, next));
        }
    }
}
