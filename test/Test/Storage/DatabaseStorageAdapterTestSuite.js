import TestSuite from "WaveFunction/TestSuite";
import {testCase} from "WaveFunction/decorators";
import Serializer from "../../../src/Fusion/Serializer/Serializer";
import {assert} from "chai";
import sinon from "sinon";
import DatabaseStorageAdapter from "../../../src/Fusion/Storage/Database/DatabaseStorageAdapter";

export default class DatabaseStorageAdapterTestSuite extends TestSuite {

    adapter = null;

    beforeEach() {
        let connection = {
            from: () => {},
            insert: () => {},
            first: () => {},
            where: () => {},
            del: () => {},
            orderBy: () => {}
        };

        let connectionInterface = {
            query: () => connection
        };

        this.serializer = new Serializer();
        this.serializer.forType(String, i => i, i => i);

        this.fromSpy = sinon.stub(connection, 'from');
        this.insertSpy = sinon.stub(connection, 'insert');
        this.firstSpy = sinon.stub(connection, 'first');
        this.whereSpy = sinon.stub(connection, 'where');
        this.delSpy = sinon.stub(connection, 'del');
        this.orderBySpy = sinon.stub(connection, 'orderBy');

        this.fromSpy.returns(connection);
        this.whereSpy.returns(connection);
        this.insertSpy.returns(connection);
        this.orderBySpy.returns(connection);


        this.adapter    = new DatabaseStorageAdapter(connectionInterface, this.serializer);
        this.adapter.setTable('storage');
    }

    @testCase()
    async testSetAValueSuccessful() {
        let clock = sinon.useFakeTimers();

        let currentTime = 3;
        clock.tick(currentTime);

        await this.adapter.set('foo', 'bar');

        assert(this.fromSpy.calledWith('storage'));
        assert(this.insertSpy.calledWith({
            key: 'foo',
            value: this.serializer.serialize("bar"),
            created_at: currentTime
        }));
    }

    @testCase()
    async testGetWhenTheValueIsExisted() {
        this.firstSpy.returns(Promise.resolve({value: this.serializer.serialize("bar")}));

        let result = await this.adapter.get("foo");

        assert(this.fromSpy.calledWith('storage'));
        assert(this.whereSpy.calledWith('key', '=', 'foo'));
        assert(this.firstSpy.called);
        assert(this.orderBySpy.calledWith('created_at', 'desc'));
        assert.equal(result, "bar");
    }

    @testCase()
    async testGetWhenTheValueIsNotExisted() {
        this.firstSpy.returns(Promise.resolve(null));

        let result = await this.adapter.get("someKey");

        assert(this.fromSpy.calledWith('storage'));
        assert(this.whereSpy.calledWith('key', '=', 'someKey'));
        assert(this.firstSpy.called);
        assert(this.orderBySpy.calledWith('created_at', 'desc'));
        assert.equal(result, null);
    }

    @testCase()
    async testUnsetAKey() {
        await this.adapter.unset('foo');
        assert(this.fromSpy.calledWith('storage'));
        assert(this.whereSpy.calledWith('key', '=', 'foo'));
        assert(this.delSpy.called);
    }

    @testCase()
    async testWhenTheValueIsExpiredDate() {
        let clock = sinon.useFakeTimers();
        let expiredTime = 1000;
        let options = {
            expiredTime: expiredTime
        };

        this.firstSpy.returns(Promise.resolve({
            value: this.serializer.serialize("bar"),
            created_at: new Date().getTime()
        }));

        clock.tick(expiredTime + 1);

        let result = await this.adapter.get("foo", options);

        assert(this.fromSpy.calledWith('storage'));
        assert(this.whereSpy.calledWith('key', '=', 'foo'));
        assert(this.firstSpy.called);
        assert.isNull(result);
    }
}