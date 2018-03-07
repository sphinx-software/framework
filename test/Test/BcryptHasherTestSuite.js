import TestSuite from "WaveFunction/TestSuite";
import {testCase} from "WaveFunction/decorators";
import {assert} from "chai";
import BcryptHasher from "../../src/Fusion/Hash/BCryptHasher";
import bcrypt from 'bcrypt';

export default class BcryptHasherTestSuite extends TestSuite {

    beforeEach() {
        this.bcryptHasher = new BcryptHasher(bcrypt);
        this.bcryptHasher.setRounds(10);
    };

    @testCase()
    async testCheckTheHashWasGenerateBefore() {
        let hash = await this.bcryptHasher.generate("someText");
        assert.isTrue(await this.bcryptHasher.check("someText", hash));
    }
}
