import TestSuite from "WaveFunction/TestSuite";
import {testCase} from "WaveFunction/decorators";
import {assert} from "chai";
import NullStorageAdapter from "../../../src/Fusion/Storage/Null/NullStorageAdapter";

export default class NullStorageAdapterTestSuite extends TestSuite {

    beforeEach() {
        this.adapter = new NullStorageAdapter();
    }

    @testCase()
    async testAlwaysReturnNull() {
        this.adapter.set("abc", {"foo": "bar"});
        assert.isNull(await this.adapter.get("abc"));
    }
}