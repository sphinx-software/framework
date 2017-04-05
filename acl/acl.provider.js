const lodash  = require('lodash');
const Acl     = require('acl');
const AclKnex = require('acl-knex');
const VError  = require('verror');
const AclListCommand = require('./acl-list.command');

let factoryBackendAdapter = async (backend, container, prefix) => {
    switch (backend) {
        case 'memory':
            return new Acl.memoryBackend();
        case 'redis':
            return new Acl.redisBackend(await container.make('redis'), prefix);
        case 'database':
            return new AclKnex(await container.make('database'), prefix);
        case 'mongo':
            return new Acl.mongodbBackend(await container.make('mongo', prefix));
        default:
            throw new VError(`E_ACL: Backend [%s] is not supported`, backend);
    }
};

exports.register = (container) => {
    container.singleton('acl', async () => {
        let config  = await container.make('config');

        let acl = new Acl(await factoryBackendAdapter(config.acl.backend, container, 'sphinx-acl'));

        acl.allow(config.acl.rules);

        return acl;
    });
};
