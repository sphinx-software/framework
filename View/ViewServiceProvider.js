import {EventEmitter} from 'events';
import ViewFactory from './ViewFactory';
import {provider} from "../Fusion/Fusion";

@provider()
export default class ViewServiceProvider {
    constructor(container) {
        this.container = container;
    }

    register() {
        this.container.singleton('view', async () => {
            let engine = await this.container.make('view.engine');
            return new ViewFactory(new EventEmitter(), engine);
        });
    }
}
