const MongoClient = require('mongodb').MongoClient;
const Promise = require('bluebird');

let connectionPromise = Promise.promisify(MongoClient.connect, {context: MongoClient});

exports.register = (container) => {
    container.singleton('mongo', async () => {
        let config = await container.make('config');

        return await connectionPromise(config.mongo);
    });
};
