import { controller, get } from '../../../Http';
import { singleton }       from '../../../MetaInjector';

@singleton('logger')
export class HelloMiddleware {

    constructor(logger) {
        this.logger = logger;
    }

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

    @get('/', [HelloMiddleware])
    async foo(context) {
        context.body.config = this.config;
        context.body.hash   = await this.hash.generate('test');
    }
}
