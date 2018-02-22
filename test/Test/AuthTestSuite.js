import TestSuite from "WaveFunction/TestSuite";
import {testCase} from "WaveFunction/decorators";
import {assert} from "chai";
import sinon from "sinon";
import Auth from "../../src/Fusion/Auth/Auth";

export default class AuthTestSuite extends TestSuite {

    beforeEach(context) {
        this.sessionMock = {
            set: () => {},
            unset: () => {},
            has: () => {},
            get: () => {}
        };

        this.auth = new Auth()
            .setSession(this.sessionMock)
            .setSessionAuthKey("someAuthKey")
        ;

    }

    @testCase()
    testLogin() {

        let setSpy = sinon.stub(this.sessionMock, 'set');
        let getSpy = sinon.stub(this.sessionMock, 'get');

        this.auth.login("credential");

        assert(setSpy.calledWith("someAuthKey", "credential"));
        getSpy.returns("credential");
        assert.equal("credential", this.auth.getCredential());
        assert(getSpy.calledWith("someAuthKey"));
    }

    @testCase()
    testLogout() {
        let unsetSpy = sinon.stub(this.sessionMock, 'unset');

        this.auth.logout();

        assert(unsetSpy.calledWith("someAuthKey"));
    };

    @testCase()
    testWhenUserLoggedIn() {
        let hasSpy = sinon.stub(this.sessionMock, 'has');

        hasSpy.returns(true);

        assert(this.auth.loggedIn());
        assert.isFalse(this.auth.guest());
    }

    @testCase()
    testWhenUserIsGuest() {
        let hasSpy = sinon.stub(this.sessionMock, 'has');

        hasSpy.returns(false);

        assert.isFalse(this.auth.loggedIn());
        assert(this.auth.guest());
    }
}
