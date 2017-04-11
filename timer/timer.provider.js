const Timer = require('./timer');

exports.register = container =>
    container.singleton('timer', async => new Timer())
;
