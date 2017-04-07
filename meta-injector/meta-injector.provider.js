let MetaInjector = require('./meta-injector');

exports.register = (container) => {
    let injector = new MetaInjector();

    container.resolved.config.injects.forEach(function (Symbol) {
        injector.inject(Symbol, container);
    });
};
