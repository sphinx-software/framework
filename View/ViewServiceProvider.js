import {EventEmitter} from 'events';
import ViewFactory from './ViewFactory';
import {provider} from "../Fusion/Fusion";
import {ViewFactoryInterface} from "../Fusion/ServiceContracts";

@provider()
export default class ViewServiceProvider {
    constructor(container, fusion) {
        this.container = container;
        this.fusion    = fusion;
    }

    register() {
        this.container.singleton(ViewFactoryInterface, async () => {
            let engine = await this.container.make('view.engine');
            return new ViewFactory(new EventEmitter(), engine);
        });
    }

    async boot() {
        let viewFactory = await this.container.make(ViewFactoryInterface);

        let viewRenderingMacros = this.fusion.getByManifest('view.decorator.rendering');

        viewRenderingMacros.map(async Macro => {
            let templateName = Reflect.getMetadata('view.decorator.rendering', Macro);
            let macro        = await this.container.make(Macro);

            viewFactory.rendering(templateName, (...parameters) => macro.run(...parameters));
        });

        viewRenderingMacros.map(async Macro => {
            let templateName = Reflect.getMetadata('view.decorator.making', Macro);
            let macro        = await this.container.make(Macro);

            viewFactory.making(templateName, (...parameters) => macro.run(...parameters));
        });
    }
}

export function viewRendering(templateName) {
    return Reflect.metadata('view.decorator.rendering', templateName);
}

export function viewMaking(templateName) {
    return Reflect.metadata('view.decorator.making', templateName);
}
