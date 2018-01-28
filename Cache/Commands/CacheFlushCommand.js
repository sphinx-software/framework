import { command } from "../../Console/index";
import { singleton } from "../../MetaInjector";
import { CacheInterface } from "../../Fusion/ServiceContracts";
import chalk from 'chalk';

@singleton(CacheInterface)
@command('cache:flush', 'Flushes the cache storage')
export default class CacheFlushCommand {
    constructor(cache) {
        this.cache = cache;
    }

    async action() {
        await this.cache.flush();
        console.log(chalk.yellow('Done'));
    }
}
