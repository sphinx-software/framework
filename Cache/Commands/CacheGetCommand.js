import {args, command} from "../../Console";
import {singleton} from "../../MetaInjector";
import {CacheInterface} from "../../Fusion/ServiceContracts";
import chalk from 'chalk';

@singleton(CacheInterface)
@command('cache:get', 'Gets a cache value')
@args('<cache-key> [default]')
export default class CacheGetCommand {
    constructor(cache) {
        this.cache = cache;
    }

    async action(cacheKey, defaultValue) {
        console.log(chalk.yellow(JSON.stringify(await this.cache.get(cacheKey, defaultValue))));
    }
}
