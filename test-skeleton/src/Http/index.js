import { controller, get } from '../../../Http';
import { singleton }       from '../../../MetaInjector';

@singleton()
export class HelloMiddleware {

    async handle(context, next) {
        context.body = { hello: 'world' };
        await next();
    }
}

@singleton('config', 'cache')
@controller()
export class WelcomeController {
    constructor(config, cache) {
        this.config = config;
        console.log(cache);
    }

    @get('/hello', [HelloMiddleware])
    async foo(context) {
        context.body.config = this.config;
    }
}
