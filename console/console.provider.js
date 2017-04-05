const program = require('commander');
const ConsoleKernel  = require('./console-kernel');

exports.register = (container) => {
    container.singleton('console.kernel', async () => {
        let config = await container.make('config');

        return new ConsoleKernel(program, container);
    });
};
