'use strict';

const VError = require('verror');

/**
 * @class Container
 */
class Container {

    /**
     *
     * @param {EventEmitter} ee
     */
    constructor(ee) {
        this.bindings = {};
        this.resolved = {'events': ee};
        this.ee       = ee;
    }

    /**
     * Register a factory of a dependency to the Container
     *
     * @param {string} dependencyName
     * @param {Function} factory
     * @returns {Container}
     */
    bind(dependencyName, factory) {
        this.bindings[dependencyName] = {
            factory: factory,
            type: 'binding'
        };

        return this;
    }

    /**
     * Register a value as a dependency to the Container
     *
     * @param {string} dependencyName
     * @param value
     * @return {Container}
     */
    value(dependencyName, value) {
        this.resolved[dependencyName] = value;

        return this;
    }

    /**
     * Register a dependency to the Container as a singleton
     *
     * @param {string} dependencyName
     * @param {Function} factory
     * @returns {Container}
     */
    singleton(dependencyName, factory) {
        this.bindings[dependencyName] = {
            factory: factory,
            type: 'singleton'
        };

        return this;
    }

    /**
     * Resolve a dependency
     *
     * @param {string} dependencyName
     * @param constructorParameters
     * @returns {Promise.<*>}
     */
    async make(dependencyName, ...constructorParameters) {

        if (this.resolved[dependencyName]) {
            return this.resolved[dependencyName];
        }

        let bindingRecipe = this.bindings[dependencyName];

        if (!bindingRecipe) {
            throw new VError(`E_CONTAINER: Could not resolve dependency [%s]`, dependencyName);
        }

        this.ee.emit(Container.generateMakingEventName(dependencyName), bindingRecipe);

        let resolved = await bindingRecipe['factory'](this, ...constructorParameters);

        this.ee.emit(Container.generateMadeEventName(dependencyName), resolved);

        if ('singleton' === bindingRecipe['type']) {
            this.resolved[dependencyName] = resolved
        }

        return resolved;
    }

    /**
     * Register an event listener to the Container
     * to handle right before resolving a dependency
     *
     * @param {string} dependencyName
     * @param {Function} handler
     * @return {Container}
     */
    making(dependencyName, handler) {
        this.ee.on(Container.generateMakingEventName(dependencyName), handler);

        return this;
    }

    /**
     * Register an event listener to the Container
     * to handle right after resolved a dependency
     *
     * @param {string} dependencyName
     * @param {Function} handler
     * @return {Container}
     */
    made(dependencyName, handler) {
        this.ee.on(Container.generateMadeEventName(dependencyName), handler);

        return this;
    }

    static generateMakingEventName(dependencyName) {
        return `container.${dependencyName}.making`
    }

    static generateMadeEventName(dependencyName) {
        return `container.${dependencyName}.made`
    }
}



module.exports = Container;
