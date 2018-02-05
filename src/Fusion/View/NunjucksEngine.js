import nunjucks from 'nunjucks';
import {provider} from "../Fusion";

class SphinxLoader {
    constructor(nunjuckFileSystemLoader) {
        this.loader = nunjuckFileSystemLoader;
        this.extension = 'njk.html';
    }

    getSource(temlateName) {
        return this.loader.getSource(this.resolveFileName(temlateName));
    }

    setExtension(extension) {
        this.extension = extension;
        return this;
    }

    resolveFileName(templateName) {
        return templateName.endsWith('.' + this.extension) ? templateName : templateName + '.' + this.extension;
    }
}

class NunjucksEngine {

    constructor(nunjucksEnvironment) {
        this.nunjuckEnvironment = nunjucksEnvironment;
    }

    /**
     *
     * @param {View} view
     * @return {Promise<string>}
     */
    async render(view) {
        let env = this.nunjuckEnvironment;

        return await new Promise((resolve, reject) => {
            env.render(view.getTemplate(), view.getData(), (error, result) => {
                if (error) {
                    return reject(error);
                }

                return resolve(result);
            });
        });
    }
}

@provider()
export class ViewEngineNunjucksServiceProvider {
    constructor(container) {
        this.container = container;
    }

    register() {
        this.container.singleton('view.engine', async () => {
            let config = await this.container.make('config');
            return new NunjucksEngine(
                new nunjucks.Environment(
                    new SphinxLoader(new nunjucks.FileSystemLoader(config.view.directory, config.view.options))
                )
            )
        })
    }
}
