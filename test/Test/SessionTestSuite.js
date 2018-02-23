import TestSuite from "WaveFunction/TestSuite";
import {testCase} from "WaveFunction/decorators";
import {assert} from "chai";
import {Serializer} from "../../src/Fusion/Serializer";
import {Session} from "../../src/Fusion/Session"

export default class SessionTestSuite extends TestSuite {

    beforeEach() {
        this.serializer = new Serializer().forType(String, i => i, i => i);
        this.session = new Session(this.serializer);
    }

    @testCase()
    testInitializeData() {
        this.session.init("someInitData");
        assert.equal("someInitData", this.session.toJson());
    }

    @testCase()
    testGetBackTheDataThatSettedBefore() {
        this.session.set("champion", "hasagi");
        assert.equal("hasagi", this.session.get("champion"));
    }

    @testCase()
    testHasTheKeyThatSettedBefore() {
        this.session.set("champion", "ahri");
        assert.isTrue(this.session.has("champion"));
    }

    @testCase()
    testUnsetSuccessfullyWithTheKeyThatSettedBefore() {
        this.session.set("champion", "riven");
        this.session.unset("champion");
        assert.isNull(this.session.get("champion"));
    }

    @testCase()
    testRaiseTheShouldDestroyFlag() {
        this.session.destroy();
        assert.isTrue(this.session.shouldDestroy());
    }
}