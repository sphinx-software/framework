const View = require('./view');

class ViewFactory {

    /**
     *
     * @param {EventEmitter} eventEmitter
     * @param {ViewEngine} viewEngine
     */
    constructor(eventEmitter, viewEngine) {
        this.eventEmitter  = eventEmitter;
        this.viewEngine    = viewEngine;
    }

    /**
     * Creates a view object
     *
     * @param {string} template
     * @param {*} data
     * @return {View}
     */
    make(template, data = {}) {
        let view = new View(template, data);
        this.eventEmitter.emit(`views.making.${template}`, view);
        this.eventEmitter.emit('views.making', view);
        return view;
    }

    /**
     *
     * @param {View} view
     * @return {Promise.<string>}
     */
    async render(view) {
        this.eventEmitter.emit(`views.rendering.${view.getTemplate()}`, view);
        this.eventEmitter.emit('views.rendering', view);
        return await this.viewEngine.render(view);
    }

    /**
     * Register a handler when the view object is created
     *
     * @param {string} template
     * @param {Function} callback
     * @return {ViewFactory}
     */
    making(template, callback) {
        this.eventEmitter.on(`views.making.${template}`, callback);
        return this;
    }

    /**
     * Register a handler when the view object will be rendered
     *
     * @param {string} template
     * @param {Function} callback
     * @return {ViewFactory}
     */
    rendering(template, callback) {
        this.eventEmitter.on(`views.rendering.${template}`, callback);
        return this;
    }

    /**
     * Register global data. Useful for extends the view functionality
     *
     * @param {string} name
     * @param {*} value
     * @return {ViewFactory}
     */
    global(name, value) {
        this.eventEmitter.on('views.rendering', function (view) {
            view.bind(name, value);
        });

        return this;
    }
}

module.exports = ViewFactory;
