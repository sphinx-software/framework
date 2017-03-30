const Serializer = require('./serializer');

exports.register = (container) => {
    container.singleton(
        'serializer',
        () => new Serializer()
            .forType(Object, item => item, data => data)
            .useDefault(Object)
    );
};
