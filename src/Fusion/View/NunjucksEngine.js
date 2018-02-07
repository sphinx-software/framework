import nunjucks from 'nunjucks';
import {provider} from "../Fusion";
import {ViewEngineInterface} from "../ServiceContracts";

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

/**
 * @implements ViewEngineInterface
 */
export class NunjucksEngine {

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


    addFilter(filterName, filter) {
        this.nunjuckEnvironment
            .addFilter(filterName, (...parameters) => filter.run(...parameters))
        ;
        return this;
    }
}

@provider()
export class ViewEngineNunjucksServiceProvider {
    constructor(container, fusion) {
        this.container = container;
        this.fusion    = fusion;
    }

    register() {

        this.container.singleton('view.environment', async () => {
            let config = await this.container.make('config');
            return new nunjucks.Environment(
                new SphinxLoader(new nunjucks.FileSystemLoader(config.view.directory, config.view.options))
            );
        });

        this.container.singleton(ViewEngineInterface, async () => {
            let env    = await this.container.make('view.environment');
            return new NunjucksEngine(env);
        });
    }

    async boot() {
        let engine  = await this.container.make(ViewEngineInterface);
        let filters = this.fusion.getByManifest('view.nunjucks.filter');

        await Promise.all(filters.map(async (FilterClass) => {
            let filterName = Reflect.getMetadata('view.nunjucks.filter', FilterClass);
            let filter     = this.container.make(FilterClass);

            engine.addFilter(filterName, filter);
        }));
    }
}
