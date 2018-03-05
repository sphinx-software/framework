import TestSuite from "WaveFunction/TestSuite";
import {testCase} from "WaveFunction/decorators";
import {assert} from "chai";
import Mailer from "../../../src/Fusion/Mail/Mailer";
import TransportManager from "../../../src/Fusion/Mail/TransportManager";
import Mail from "../../../src/Fusion/Mail/Mail";
import sinon from "sinon";


export default class MailerTestSuite extends TestSuite {

    beforeEach() {
        this.viewFactory = {
            make: () => {},
            render: () => {}
        };

        this.makeSpy = sinon.stub(this.viewFactory, 'make');
        this.renderSpy = sinon.stub(this.viewFactory, 'render');

        let transportManager = new TransportManager();
        this.mailer = new Mailer(
            this.viewFactory,
            transportManager,
            {}
        );
    }

    afterEach() {
        this.makeSpy.restore();
        this.renderSpy.restore();
        this.mailer = null;
    }

    @testCase()
    async testComposeAMail() {
        this.makeSpy.returns({
            name: "fooView"
        });
        let mail = await this.mailer.compose('fooTemplate', {data: "yolo"});
        assert(this.makeSpy.calledWith('fooTemplate'), {data: "yolo"});
        assert(this.renderSpy.calledWith({
            name: "fooView"
        }));
        assert.instanceOf(mail, Mail);
    }
}