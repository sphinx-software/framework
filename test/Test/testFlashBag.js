import {testCase} from "WaveFunction/decorators";
import FusionTestSuite from "./FusionTestSuite";
import * as MetaInjector from "Fusion/MetaInjector";
import FlashBag from "../../src/Fusion/View/FlashBag";
import {assert} from "chai";

export class testFlashBag extends FusionTestSuite {

    @testCase()
    async testGetDataByKeyForFlash() {
        let data = {'a': {'b': {'c': 3}}};
        let flashBag = new FlashBag(data);
        flashBag.setData(data);
        assert.equal(flashBag.get('a.b.c'), 3);
    }

    @testCase()
    async testHasKeyForFlash() {
        let data = {'a': {'b': {'c': 3}}};
        let flashBag = new FlashBag(data);
        flashBag.setData(data);
        assert.equal(flashBag.has('a.b'), true);
    }

    manifest() {
        return {...MetaInjector};
    }

    config() {
        return {};
    }
}
