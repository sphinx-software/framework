import {args, command} from "../../Console/index";
import {singleton} from "../../MetaInjector";
import {CacheInterface} from "../../ServiceContracts";
import chalk from 'chalk';

@singleton(CacheInterface)
@command('cache:get', 'Gets a cache value')
export default class CacheGetCommand {

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
     * @param {string} defaultValue
     * @return {Promise<void>}
     */
    @args('<cache-key> [default]')
    async action(cacheKey, defaultValue) {
        console.log(chalk.yellow(JSON.stringify(await this.cache.get(cacheKey, defaultValue))));
    }
}
