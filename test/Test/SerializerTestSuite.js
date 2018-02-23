import TestSuite from "WaveFunction/TestSuite";
import {testCase} from "WaveFunction/decorators";
import {assert} from "chai"
import {Serializer} from "../../src/Fusion/Serializer";

export default class SerializerTestSuite extends TestSuite {

    beforeEach() {
        this.serializer = new Serializer();
        this.serializer.forType(String,
            (data) => data,
            (serialized) => serialized
        );
    }

    @testCase()
    testSerializeAType() {
        assert.equal(this.serializer.serialize("data"), `{"type":"String","data":"data"}`);
    }

    @testCase()
    testDeserializeAType() {
        assert.equal(this.serializer.deserialize(`{"type":"String","data":"someData"}`), "someData");
    }

    @testCase()
    testThrowWhenTheSerializerSerializeFalsyValues() {
        assert.throws(() => {
            this.serializer.serialize(undefined);
        }, "E_SERIALIZER");

        assert.throws(() => {
            this.serializer.serialize(null);
        }, "E_SERIALIZER");

        assert.equal(this.serializer.serialize(""), `{"type":"String","data":""}`);
    }

    @testCase()
    testThrowWhenTheSerializerDeserializeFalsyValues() {
        assert.throws(() => {
            this.serializer.deserialize("");
        }, "E_SERIALIZER");
    }
}