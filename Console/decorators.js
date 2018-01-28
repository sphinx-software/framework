/**
 * Decorate as a command
 *
 * @param {string} name
 * @param {string} description
 * @return {Function}
 */
export function command(name, description = '') {
    return Reflect.metadata('console.command', {name: name, description: description});
}

/**
 * Decorate the command's arguments
 *
 * @param args
 * @return {Function}
 */
export function args(args) {
    return Reflect.metadata('console.command.argument', args);
}

/**
 * Decorate the command's options
 *
 * @param name
 * @param description
 * @param formatter
 * @return {Function}
 */
export function option(name, description, formatter) {
    return Reflect.metadata('console.command.option', {
        name: name, description: description, formatter: formatter
    });
}
