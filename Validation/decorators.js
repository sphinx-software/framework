export function validator(name) {
    return Reflect.metadata('validation.validator', name);
}

export function form(rules) {
    return Reflect.metadata('validation.form', rules);
}
