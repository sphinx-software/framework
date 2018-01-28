import {args, command} from "../../Console/index";
import {singleton} from "../../MetaInjector";
import {CacheInterface} from "../../Fusion/ServiceContracts";
import chalk from 'chalk';

@singleton(CacheInterface)
@command('cache:unset', 'Deletes a value from cache')
@args('<cache-key>')
export default class CacheDeleteCommand {
    constructor(cache) {
        this.cache = cache;
    }

    async action(cacheKey) {
        await this.cache.unset(cacheKey);
        console.log(chalk.yellow('Done'));
    }
}