import {kernelMiddleware, controller, get} from "../../../Http";
import {singleton} from "../../../MetaInjector";

@singleton()
export class HelloMiddleware {

    async handle(context, next) {
        context.body = {hello: 'world'};
        await next();
    }
}


@singleton('config')
@controller()
export class WelcomeController {
    constructor(config) {
        this.config = config;
    }

    @get('/hello', [HelloMiddleware])
    async foo(context) {
        context.body.config = this.config;
    }
}