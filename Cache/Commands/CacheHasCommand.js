import {args, command} from "../../Console/index";
import {singleton} from "../../MetaInjector";
import {CacheInterface} from "../../Fusion/ServiceContracts";
import chalk from 'chalk';

@singleton(CacheInterface)
@command('cache:has', 'Checks if cache has the given key')
export default class CacheHasCommand {
    constructor(cache) {
        this.cache = cache;
    }

    @args('<cache-key>')
    async action(cacheKey) {
        console.log(chalk.yellow(JSON.stringify(!!await this.cache.get(cacheKey))));
    }
}
