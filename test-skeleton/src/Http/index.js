import {controller, get} from '../../../Http';
import {singleton} from '../../../MetaInjector';

@singleton()
export class HelloMiddleware {

    async handle(context, next) {
        context.body = {hello: 'world'};
        await next();
    }
}

@singleton('config', 'hash', 'mailer')
@controller()
export class WelcomeController {
    constructor(config, hash, mailer) {
        this.config = config;
        this.hash   = hash;
        this.mailer   = mailer;
    }

    @get('/', [HelloMiddleware])
    async foo(context) {
        console.log(this.mailer);
        context.body.config = this.config;
        context.body.hash   = await this.hash.generate('test');
    }
}
