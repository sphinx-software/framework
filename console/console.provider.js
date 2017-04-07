const program = require('commander');
const ConsoleKernel  = require('./console-kernel');

exports.register = (container) => {
    container.singleton('console.kernel', async () => {
        return new ConsoleKernel(program, container);
    });
};
