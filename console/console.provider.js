const program = require('commander');

exports.register = (container) => {
    // TODO need to standardize the kernel
    container.singleton('console.kernel', async () => {
        let config = await container.make('config');

        program.container = container;

        return program.version('0.0.1').command('*').option('--version').action(function () {
            console.log('0.0.1')
        });
    });
};
