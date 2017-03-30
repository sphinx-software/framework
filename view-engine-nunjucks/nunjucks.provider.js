const nunjucks       = require('nunjucks');
const NunjucksEngine = require('./nunjucks-engine');
const SphinxLoader   = require('./sphinx-loader');

exports.register = (container) => {
    container.singleton('view.engine', async () => {
        let config = await container.make('config');
        return new NunjucksEngine(
            new nunjucks.Environment(
                new SphinxLoader(new nunjucks.FileSystemLoader(config.view.directory, config.view.options))
            )
        )
    })
};
