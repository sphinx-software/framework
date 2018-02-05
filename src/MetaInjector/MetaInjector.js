export default class MetaInjector {

    /**
     *
     * @param {Container} container
     */
    constructor(container) {
        this.container = container;
    }

    /**
     *
     * @param {Function} Symbol
     */
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