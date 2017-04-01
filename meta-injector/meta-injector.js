class MetaInjector {

    inject(Symbol, container) {
        container[Symbol.type || 'singleton'](Symbol.alias || Symbol.name, async () => {
            let dependenciesAliases = Symbol.dependencies || [];
            let dependencies        = await Promise.all(dependenciesAliases.map( alias => container.make(alias)));

            return Reflect.construct(Symbol, dependencies);
        });
    }
}

module.exports = MetaInjector;
