import {testCase} from "WaveFunction/decorators";
import TestSuite from "WaveFunction/TestSuite";
import FlashBag from "../../../src/Fusion/View/FlashBag";
import {assert} from "chai";

export class FlashBagTestSuite extends TestSuite {

    flashBag = null;


    before() {
        this.flashBag = new FlashBag({'a': {'b': {'c': 3}}});
    }

    @testCase()
    testGetDataByKeyForFlash() {
        assert.equal(this.flashBag.get('a.b.c'), 3);
        assert(this.flashBag.has('a.b'));
    }

    @testCase()
    testGetDataWhenKeyIsNotExisted() {
        assert.isNull(this.flashBag.get('not.existed.key'));
        assert.equal(this.flashBag.get('not.existed.key', 'defaultValue'), 'defaultValue')
        assert.isFalse(this.flashBag.has('not.existed.key'));
    }
}
