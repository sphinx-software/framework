import {kernelMiddleware} from "../../../Http/index";
import {singleton} from "../../../MetaInjector";

@singleton()
@kernelMiddleware()
export class HelloMiddleware {

    async handle(context, next) {
        context.body = {hello: 'world'};
        await next();
    }
}
