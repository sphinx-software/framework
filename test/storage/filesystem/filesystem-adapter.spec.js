const assert = require('chai').assert;
const sinon  = require('sinon');
const fs     = require('fs');

const FileSystemStorageAdapter  = require('../../../storage/adapters/filesystem/filesystem-storage-adapter');
const StorageFileNamingConvention = require('../../../storage/adapters/filesystem/storage-file-naming-convention');


describe('FilesystemStorageAdapter test suite', () => {
    let serializerStub = {};
    let storage = null;

    beforeEach(() => {

        serializerStub.serialize = sinon.stub();
        serializerStub.serialize.returnsArg(0);

        serializerStub.deserialize = sinon.stub();
        serializerStub.deserialize.returnsArg(0);

        storage = new FileSystemStorageAdapter(serializerStub, fs, new StorageFileNamingConvention().setPrefix('testing')).setStorageDirectory(__dirname + '/.tmp');
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
        after(async () => {
            storage.unset('fuu')
        });
    });
});
