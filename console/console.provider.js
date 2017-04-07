const program           = require('commander');
const ConsoleKernel     = require('./console-kernel');
const fs                = require('fs');

exports.register = (container) => {
    container.singleton('console.kernel', async () => {

        program
            .version(fs.readFileSync(__dirname + '/header.txt', {encoding: 'utf-8'}))
            .option('-v, --verbose', 'set the output verbosity', (v, total) => total + 1, 0)
        ;

        return new ConsoleKernel(program, container);
    });
};
