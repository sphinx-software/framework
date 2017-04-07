const program = require('commander');
const ConsoleKernel  = require('./console-kernel');
let fs = require('fs');

exports.register = (container) => {
    container.singleton('console.kernel', async () => {

        program.version(fs.readFileSync(__dirname + '/header.txt', {encoding: 'utf-8'}));

        return new ConsoleKernel(program, container);
    });
};
