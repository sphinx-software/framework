import { controller, get } from '../../../Http';
import { singleton }       from '../../../MetaInjector';

@singleton()
@controller()
export class WelcomeController {

    @get('/')
    async foo(context) {
        context.body = context.view.make('welcome');
    }
}
