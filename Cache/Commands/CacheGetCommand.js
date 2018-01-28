import {args, command} from "../../Console/index";
import {singleton} from "../../MetaInjector";
import {CacheInterface} from "../../Fusion/ServiceContracts";
import chalk from 'chalk';

@singleton(CacheInterface)
@command('cache:get', 'Gets a cache value')
export default class CacheGetCommand {

    constructor(cache) {
        this.cache = cache;
    }

    @args('<cache-key> [default]')
    async action(cacheKey, defaultValue) {
        console.log(chalk.yellow(JSON.stringify(await this.cache.get(cacheKey, defaultValue))));
    }
}
