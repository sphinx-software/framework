import {Config, HttpRouter} from "../ServiceContracts";
import Router from "koa-router";
import {provider} from "../Fusion";

@provider()
export default class HttpRouterServiceProvider {

    /**
     *
     * @param {Container} container
     * @param {Fusion} fusion
     */
    constructor(container, fusion) {
        this.container = container;
        this.fusion    = fusion;
    }

    /**
     *
     */
    register() {
        this.container.singleton(HttpRouter, async () => {
            let config = await this.container.make(Config);

            return new Router(config.http.router);
        }).made(HttpRouter, async (router) => {
            let controllers = this.fusion.getByManifest('http.controller');

            await Promise.all(controllers.map(Controller => this.bindController(router, Controller)));

            return router;
        });
    }

    /**
     *
     * @param router
     * @param Controller
     * @return {Promise<void>}
     */
    async bindController(router, Controller) {
        let controller = await this.container.make(Controller);

        let controllerActionNames = Object.getOwnPropertyNames(Controller.prototype)
            .filter(methodName => Reflect.hasMetadata('http.action', controller, methodName));

        for (let index = 0; index < controllerActionNames.length; index++) {
            let actionName  = controllerActionNames[index];
            let metadata    = Reflect.getMetadata('http.action', controller, actionName);
            let middlewares = await Promise.all(metadata.middlewares.map(middleware => this.container.make(middleware)));

            router[metadata.method](
                // The route name
                `${Controller.name}@${actionName}`,

                // The route url
                metadata.url,

                // Middleware handlers
                ...middlewares.map(middleware => (context, next) => middleware.handle(context, next)),

                // Controller's action
                (context, next) => controller[actionName](context, next));
        }
    }
}
