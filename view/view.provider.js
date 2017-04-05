const EventEmitter       = require('events').EventEmitter;
const ViewFactory        = require('./view-factory');

exports.register = (container) => {

    container.singleton('view', async () => {
        let engine = await container.make('view.engine');
        return new ViewFactory(new EventEmitter(), engine);
    });
};

exports.boot = async(container) => {
    let kernel = await container.make('http.kernel');
    kernel.use(require('./view-render.middleware'));
};