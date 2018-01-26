import { controller, get } from '../../../Http';
import { singleton }       from '../../../MetaInjector';

@singleton()
export class HelloMiddleware {

    async handle(context, next) {
        context.body = { hello: 'world' };
        await next();
    }
}

@singleton('config', 'hash')
@controller()
export class WelcomeController {
    constructor(config, hash) {
        this.config = config;
        this.hash   = hash;
    }

    @get('/', [HelloMiddleware])
    async foo(context) {
        context.body.config = this.config;
        context.body.hash   = await this.hash.generate('test');
    }
}
