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

@singleton()
@controller()
export class WelcomeController {
    @get('/', [HelloMiddleware])
    async foo(context) {
        context.body = context.view.make('welcome');
    }
}
