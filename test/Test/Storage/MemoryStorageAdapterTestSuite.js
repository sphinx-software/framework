import MemoryStorageAdapter from "../../../src/Fusion/Storage/Memory/MemoryStorageAdapter";
import TestSuite from "WaveFunction/TestSuite";
import {testCase} from "WaveFunction/decorators";
import {assert} from "chai";

export default class MemoryStorageAdapterTestSuite extends TestSuite {

    beforeEach() {
        this.ttl = 60*60*1000;
        this.expiredAt = new Date(new Date().getTime() + this.ttl);
        let initialData = [
            {
                key: "someKey",
                tags: "hello",
                value: {
                    foo: "bar"
                },
                expiredAt: this.expiredAt,
            },
            {
                key: "someOtherKey",
                tags: "hello",
                value: {
                    yo: "lo"
                },
                expiredAt: this.expiredAt,
            }
        ];
        this.apdater = new MemoryStorageAdapter(initialData);
        this.apdater.setDefaultTTL(this.ttl);
    }

    afterEach() {
        this.apdater = null;
        this.ttl = null;
        this.expiredAt = null;
    }

    @testCase()
    async testGetByTagSuccessful() {
        assert.deepEqual([
            {foo: "bar"},{yo: "lo"}
        ], await this.apdater.getByTag("hello"));
    }

    @testCase()
    async testGetSuccessful() {
        assert.deepEqual({
            foo: "bar"
        }, await this.apdater.get("someKey"));
    }

    @testCase()
    async testSetSuccessful() {
        await this.apdater.set("hasagi", {yo: "lo"});
        assert.deepEqual({yo: "lo"}, this.apdater.store.find((item) => item.key === "hasagi").value);
    }

    @testCase()
    async testUnset() {
        await this.apdater.unset("someKey");
        assert.isNotOk(this.apdater.store.find((item) => item.key === "someKey"));
    }
}