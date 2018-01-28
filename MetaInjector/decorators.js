/**
 *
 * @param {Function} injectType
 * @param {Array} dependencies
 * @return {Function}
 */
export function inject(injectType, ...dependencies) {
    return Reflect.metadata('meta-injector',
        { type: injectType, dependencies: dependencies });
}

/**
 *
 * @param {Array} dependencies
 * @return {Function}
 */
export function singleton(...dependencies) {
    return Reflect.metadata('meta-injector',
        { type: 'singleton', dependencies: dependencies });
}

/**
 *
 * @param {Array} dependencies
 * @return {Function}
 */
export function bind(...dependencies) {
    return Reflect.metadata('meta-injector',
        { type: 'bind', dependencies: dependencies });
}
