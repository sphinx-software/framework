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
        };

        let connectionInterface = {
            query: () => connection
        };

        this.serializer = new Serializer();
        this.serializer.forType(Object, i => i, i => i);

        this.fromSpy = sinon.stub(connection, 'from');
        this.insertSpy = sinon.stub(connection, 'insert');
        this.firstSpy = sinon.stub(connection, 'first');
        this.whereSpy = sinon.stub(connection, 'where');
        this.delSpy = sinon.stub(connection, 'del');

        this.fromSpy.returns(connection);
        this.whereSpy.returns(connection);
        this.insertSpy.returns(connection);

        this.adapter = new DatabaseStorageAdapter(connectionInterface, this.serializer);
        this.adapter
            .setTable('storage')
            .setDefaultTTL(60*1000)
        ;
        this.clock = sinon.useFakeTimers();
    }

    afterEach() {
        this.fromSpy.restore();
        this.firstSpy.restore();
        this.whereSpy.restore();
        this.insertSpy.restore();
        this.delSpy.restore();

        this.clock.restore();
    }

    @testCase()
    async testSetAValueSuccessful() {
        await this.adapter.set('somekey', {foo: 'bar'});

        assert(this.fromSpy.calledWith('storage'));
        assert(this.insertSpy.calledWith({
            key: 'somekey',
            value: this.serializer.serialize({foo: 'bar'}),
            created_at: new Date().getTime()
        }));
    }

    @testCase()
    async testGetWhenTheValueIsExisted() {
        let now = new Date().getTime();
        this.adapter.setDefaultTTL(2000);
        this.firstSpy.returns(Promise.resolve({
            key: 'someKey',
            value: this.serializer.serialize({foo: 'bar'}),
            created_at: now
        }));

        let result = await this.adapter.get("someKey");

        assert(this.fromSpy.calledWith('storage'));
        assert(this.whereSpy.calledWith('key', '=', 'someKey'));
        assert(this.whereSpy.calledWith('created_at', '>=', (now - 2000)));
        assert(this.firstSpy.called);
        assert.deepEqual(result, {foo: 'bar'});
    }

    @testCase()
    async testGetWhenTheValueIsNotExisted() {
        this.adapter.setDefaultTTL(2000);
        this.firstSpy.returns(Promise.resolve(null));

        let result = await this.adapter.get("someKey");


        assert(this.fromSpy.calledWith('storage'));
        assert(this.whereSpy.calledWith('key', '=', 'someKey'));
        assert(this.whereSpy.calledWith('created_at', '>=', (new Date().getTime() - 2000)));
        assert(this.firstSpy.called);
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
        let now = new Date().getTime();
        let options = {
            ttl: 1000
        };

        this.firstSpy.returns(Promise.resolve(null));

        let result = await this.adapter.get("someKey", null, options);

        assert(this.fromSpy.calledWith('storage'));
        assert(this.whereSpy.calledWith('key', '=', 'someKey'));
        assert(this.whereSpy.calledWith('created_at', '>=', now - options.ttl));
        assert(this.firstSpy.called);
        assert.isNull(result);
    }

    @testCase()
    async testWhenTheValueIsNotExpireDate() {
        let now = new Date().getTime();
        let options = {
            ttl: 1000
        };

        this.firstSpy.returns(Promise.resolve({
            key: 'someKey',
            value: this.serializer.serialize({
                foo: 'bar'
            }),
            created_at: now
        }));

        let result = await this.adapter.get("someKey", null, options);

        assert(this.fromSpy.calledWith('storage'));
        assert(this.whereSpy.calledWith('key', '=', 'someKey'));
        assert(this.whereSpy.calledWith('created_at', '>=', now - options.ttl));
        assert(this.firstSpy.called);
        assert.deepEqual(result, {foo: 'bar'});
    }
}