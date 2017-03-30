const Url = require('./url');

exports.register = (container) => {
    container.singleton('url', async () => {
        let router = await container.make('http.router');
        let config = await container.make('config');

        return new Url(router).setHost(config.http.host).setAssetsPath(config.http.asset).secure(config.http.secure);
    });
};

exports.boot = async (container) => {
    let view = await container.make('view');
    view.global('url', await container.make('url'));
};
