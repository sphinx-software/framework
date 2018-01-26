import chalk from 'chalk';
import {command, options} from "../../../Console";
import {singleton} from "../../../MetaInjector";
import {Quotes} from "../Quotes";

@singleton(Quotes)
@command('quotes:show', 'Displays a random quote')
@options(['-n, --number <n>', 'number of quotes', n => parseInt(n), 1])
export class QuoteCommand {

    constructor(quote) {
        this.quote = quote
    }

    async action() {
        for(let index = 0; index < this.context.number; index++) {
            let quote = this.quote.get();
            this.io.run(async () => {
                console.log('%s -- %s', chalk.green(quote.content), chalk.yellow(quote.author));
            });
        }
    }
}

