import TestSuite from "WaveFunction/TestSuite";
import {testCase} from "WaveFunction/decorators";
import {assert} from "chai";
import Mail from "../../../src/Fusion/Mail/Mail";
import TransportManager from "../../../src/Fusion/Mail/TransportManager";
import sinon from "sinon";


export default class MailTestSuite extends TestSuite {

    beforeEach() {
        let transport = {
            sendMail: () => {}
        };

        this.spyTransport = sinon.stub(transport, 'sendMail');

        let content = "mail content";
        let transportManager = new TransportManager();
        transportManager.addTransport("foo", transport);

        this.mail = new Mail(content, transportManager);
        this.mail.setDefaultOptions({});
    }

    @testCase()
    async testSend() {
        await this.mail.send("foo");
        assert(this.spyTransport.calledWith({
            html: "mail content"
        }))
    }
}