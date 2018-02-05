import {args, command} from "../../Console/index";
import {singleton} from "../../MetaInjector";
import {CacheInterface} from "../../ServiceContracts";
import chalk from 'chalk';

@singleton(CacheInterface)
@command('cache:has', 'Checks if cache has the given key')
export default class CacheHasCommand {

    /**
     *
     * @param {CacheInterface} cache
     */
    constructor(cache) {
        this.cache = cache;
    }

    /**
     *
     * @param {string} cacheKey
     * @return {Promise<void>}
     */
    @args('<cache-key>')
    async action(cacheKey) {
        console.log(chalk.yellow(JSON.stringify(!!await this.cache.get(cacheKey))));
    }
}
