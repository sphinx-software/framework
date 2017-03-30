class ViewEngine {

    /**
     * Renders a View instance into html
     *
     * @param {View} view
     * @return {Promise.<string>}
     */
    async render(view) {
        throw new Error('Not Implemented');
    }
}

module.exports = ViewEngine;