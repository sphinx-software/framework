export ConsoleServiceProvider from "./ConsoleServiceProvider";

export function command(name, description = '') {
    return Reflect.metadata('console.command', {name: name, description: description});
}

export function args(args) {
    return Reflect.metadata('console.command.argument', args);
}

export function option(name, description, formatter) {
    return Reflect.metadata('console.command.option', {
        name: name, description: description, formatter: formatter
    });
}
