const assert = require('chai').assert;
const sinon  = require('sinon');
const path   = require('path');

const MongoClient  = require('mongodb').MongoClient;

const MongoStorageAdapter     = require('../../../storage/adapters/mongo/mongo-storage-adapter');
const MongoTaggingStrategy    = require('../../../storage/adapters/mongo/mongo-tagging-strategy');
const MongoExpirationStrategy = require('../../../storage/adapters/mongo/mongo-expiration-strategy');

describe('MongoStorageAdapter test suite', () => {
    let serializerStub = {};
    let storage = null;
    let connection = null;

    before( async () => {

        connection = await MongoClient.connect('mongodb://localhost:27017/test-db');

        serializerStub.serialize = sinon.stub();
        serializerStub.serialize.returnsArg(0);

        serializerStub.deserialize = sinon.stub();
        serializerStub.deserialize.returnsArg(0);

        storage = new MongoStorageAdapter(
            connection,
            serializerStub,
            new MongoTaggingStrategy(),
            new MongoExpirationStrategy()
        )
            .setDefaultTTL(2000)
            .setStorageCollection('storage')
        ;

        await storage.prepare();
        await storage.flush();
    });

    afterEach(async () => {
        await storage.flush();
    });

    describe('#get() #set() test', () => {
        it('should run correctly with given data', async () => {
            await storage.set('foo', 'bar');

            assert.equal('bar', await storage.get('foo'));
        });
    });

    describe('#unset() test', () => {
        it('should clear the item', async () => {
            await storage.set('foo', 'bar');
            await storage.set('fuu', 'baz');
            await storage.unset('foo');

            let shouldBeNull = await storage.get('foo');
            let shouldBeBaz  = await storage.get('fuu');

            assert.isNull(shouldBeNull);
            assert.equal(shouldBeBaz, 'baz');
        });
    });

    describe('#getByTag() test', () => {
        it('should get all of the tagged items', async () => {
            await storage.set('foo', 'bar', {
                tags: ['tag1']
            });

            await storage.set('fooo', 'barr', {
                tags: ['tag1', 'tag2']
            });

            await storage.set('foooo', 'barrr', {
                tags: ['tag1', 'tag2', 'tag3']
            });

            let tag1Result = await storage.getByTag('tag1');
            assert.equal(tag1Result.length, 3);

            let tag2Result = await storage.getByTag('tag2');
            assert.equal(tag2Result.length, 2);

            let tag3Result = await storage.getByTag('tag3');
            assert.equal(tag3Result.length, 1);
        });
    });

    describe('#cleanup() test', () => {
        it('should clear expired items', async () => {
            await storage.set('foo', 'bar', {
                ttl: -1
            });

            let result = await connection.collection('storage').find().toArray();

            assert(result.length);

            await storage.cleanup();

            result = await connection.collection('storage').find().toArray();

            assert.equal(result.length, 0);
        });
    });

    describe('#flush() test', () => {
        it('should clear all of items', async () => {
            await storage.set('foo', 'bar');
            await storage.set('fuu', 'baz');

            await storage.flush();

            assert.isNull(await storage.get('foo'));
            assert.isNull(await storage.get('fuu'));
        });
    });
});
