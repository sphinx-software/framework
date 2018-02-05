export function middleware(value) {
    return Reflect.metadata('http.kernelMiddleware', value);
}

export function controller(prefix = '') {
    return Reflect.metadata('http.controller', prefix);
}

export function action(method, url, middlewares = []) {
    return Reflect.metadata('http.action', {
        method      : method,
        url         : url,
        middlewares : middlewares
    });
}

export function get(url, middlewares = []) {
    return Reflect.metadata('http.action', {
        method      : 'get',
        url         : url,
        middlewares : middlewares
    });
}

export function post(url, middlewares = []) {
    return Reflect.metadata('http.action', {
        method      : 'post',
        url         : url,
        middlewares : middlewares
    });
}

export function put(url, middlewares = []) {
    return Reflect.metadata('http.action', {
        method      : 'put',
        url         : url,
        middlewares : middlewares
    });
}

export function del(url, middlewares = []) {
    return Reflect.metadata('http.action', {
        method      : 'del',
        url         : url,
        middlewares : middlewares
    });
}
