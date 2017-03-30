const assert = require('chai').assert;
const MemoryStorage = require('../../../storage/adapters/memory/memory-storage-adapter');

describe('MemoryStorageAdapter test suite', () => {
    let storage = null;

    beforeEach(() => {
        storage = new MemoryStorage([]);
        storage.setDefaultTTL(100);
    });

    describe('#get() #set() test', () => {
        it('should run correctly with given data', async () => {
            await storage.set('foo', 'bar');

            assert.equal('bar', await storage.get('foo'));
        });

        it('should not get expired item', async () => {
            await storage.set('foo', 'bar', {ttl: -1});

            assert.isNull(await storage.get('foo'));
            assert.equal(await storage.get('foo', 'defaultValue'), 'defaultValue');
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
