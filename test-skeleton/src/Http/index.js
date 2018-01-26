import { controller, get } from '../../../Http';
import { singleton }       from '../../../MetaInjector';
import FactoryManager      from '../../../FactoryManager';

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

@singleton('config', FactoryManager)
@controller()
export class WelcomeController {
    constructor(config, factoryManager) {
        this.config         = config;
        this.factoryManager = factoryManager;
    }

    @get('/', [HelloMiddleware])
    async foo(context) {
        console.log(await this.factoryManager.make('memory'));
        context.body.config = this.config;
    }
}
