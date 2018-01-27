export ConsoleServiceProvider from "./ConsoleServiceProvider";

export function command(name, description = '') {
    return Reflect.metadata('console.command', {name: name, description: description});
}

export function args(args) {
    return Reflect.metadata('console.command.arguments', args);
}

export function options(...options) {
    return Reflect.metadata('console.command.options', options);
}
