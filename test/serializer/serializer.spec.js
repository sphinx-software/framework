const assert = require('chai').assert;
const Serializer = require('../../Serializer/Serializer');

class TestStorageType {
    constructor(property) {
        this.property = property
    }

    method() {
        return this.property;
    }
}

class OtherType {}

describe('Serializer test suite', () => {

    describe('serialize and deserialize data', () => {
        let serializer = null;

        beforeEach(() => {

            serializer = new Serializer()
                .forType(
                    TestStorageType,
                    item => item,
                    data => new TestStorageType(data.property)
                );
        });

        it('should serialize data correctly', () => {

            let serialziedData = serializer.serialize(new TestStorageType('FooBar'));

            assert.equal(serialziedData, JSON.stringify({
                type: 'TestStorageType',
                data: {
                    property: 'FooBar'
                }
            }));
        });

        it('should throw error when input item is either null or undefined', () => {
            assert.throws(
                () => serializer.serialize(null),
                'E_SERIALIZER: Could not serialize [null] value'
            );

            assert.throws(
                () => serializer.serialize(undefined),
                'E_SERIALIZER: Could not serialize [undefined] value'
            );
        });

        it('should deserialize data correctly', () => {

            let serializedData   = serializer.serialize(new TestStorageType('FooBar'));
            let deserializedData = serializer.deserialize(serializedData);

            assert.instanceOf(deserializedData, TestStorageType);
            assert.equal(deserializedData.method(), 'FooBar');
        });

        it('should throw error when no serialize strategy was found', () => {
            assert.throws(
                () => serializer.serialize(new OtherType()),
                'E_SERIALIZER: Strategy for type [OtherType] is not supported'
            );

            assert.throws(
                () => serializer.deserialize(JSON.stringify({
                    type: 'AnotherType',
                    data: {}
                })),
                'E_SERIALIZER: Strategy for type [AnotherType] is not supported'
            );
        });
    });

    describe('deserialize data', () => {
        let serializer = null;

        beforeEach(() => {

            serializer = new Serializer()
                .forType(
                    TestStorageType,
                    item => item,
                    data => new TestStorageType(data.property)
                );
        });

        it('should throw error if the input is not deserializable', () => {
            assert.throws(
                () => serializer.deserialize('invalid input'),
                'E_SERIALIZER: Could not deserialize data'
            );

            assert.throws(
                () => serializer.deserialize(JSON.stringify({})),
                'E_SERIALIZER: Could not deserialize data: E_SERIALIZER: Missing [type] field in metadata'
            );

            assert.throws(
                () => serializer.deserialize(JSON.stringify({type: 'TestStorageType'})),
                'E_SERIALIZER: Could not deserialize data: E_SERIALIZER: Missing [data] field in metadata'
            );
        });
    });

    describe('set a default serialize strategy', () => {
        let serializer = null;

        beforeEach(() => {
            serializer = new Serializer()
                .forType(
                    TestStorageType,
                    item => item,
                    data => new TestStorageType(data.property)
                )
                .useDefault(TestStorageType)
            ;
        });

        it('can use that default strategy', () => {
            let serialized = serializer.serialize({property: 'BarFoo'});

            assert.equal(serialized, JSON.stringify({
                type: 'TestStorageType',
                data: {
                    property: 'BarFoo'
                }
            }));

            let deserialized = serializer.deserialize(serialized);

            assert.instanceOf(deserialized, TestStorageType);
            assert.equal('BarFoo', deserialized.method());
        });
    });
});