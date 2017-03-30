const View = require('./view');

module.exports = async (context, next) => {

    let container = context.container;

    context.view = await container.make('view');

    await next();

    if (context.body instanceof View) {
        context.body  = await context.view.render(context.body);
        context.type  = 'html';
    }
};
