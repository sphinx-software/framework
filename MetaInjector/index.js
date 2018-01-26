import { provider } from '../Fusion/Fusion';

export class MetaInjector {
    constructor(container) {
        this.container = container;
    }

    inject(Symbol) {
        let injectMetadata = Reflect.getMetadata('meta-injector', Symbol);

        this.container[injectMetadata.type](Symbol.name, async () => {
            let dependenciesAliases = injectMetadata.dependencies;
            let dependencies        = await Promise.all(
                dependenciesAliases.map(alias => this.container.make(alias)));

            return Reflect.construct(Symbol, dependencies);
        });
    }
}

@provider()
export class MetadataInjectorServiceProvider {
    constructor(container, fusion) {
        this.container = container;
        this.fusion    = fusion;
    }

    register() {
        let metaInjector = new MetaInjector(this.container);

        this.container.value('meta-inject', metaInjector);
        this.fusion.getByManifest('meta-injector').
            forEach(Symbol => metaInjector.inject(Symbol, this.container));
    }
}

export function inject(injectType, ...dependencies) {
    return Reflect.metadata('meta-injector',
        { type: injectType, dependencies: dependencies });
}

export function singleton(...dependencies) {
    return Reflect.metadata('meta-injector',
        { type: 'singleton', dependencies: dependencies });
}

export function bind(...dependencies) {
    return Reflect.metadata('meta-injector',
        { type: 'bind', dependencies: dependencies });
}