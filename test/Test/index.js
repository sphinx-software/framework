import {testCase} from "WaveFunction/decorators";
import FusionTestSuite from "./FusionTestSuite";
import {ViewFactoryInterface} from "Fusion";

export class TrueTestSuite extends FusionTestSuite {

    @testCase()
    async testTrue() {
        let viewFactory = await this.container.make(ViewFactoryInterface);
    }

    manifest() {
    }

    config() {
    }
}
