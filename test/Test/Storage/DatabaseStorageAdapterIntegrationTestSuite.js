import {testCase} from "WaveFunction/decorators";
import {assert} from "chai";
import sinon from "sinon";
import DatabaseIntegrationTest from "../DatabaseIntegrationTest";
import * as SerializerPackage from "../../../src/Fusion/Serializer";
import {SerializerInterface} from "../../../src/Fusion";
import DatabaseStorageAdapter from "../../../src/Fusion/Storage/Database/DatabaseStorageAdapter";

export default class DatabaseStorageAdapterIntegrationTestSuite extends DatabaseIntegrationTest {


    manifest() {

        return {
            ...super.manifest(), ...SerializerPackage
        }
    }

    async buildSchema() {

        let schema = this.dbm.connection().knexConnection.schema;

        await schema.dropTableIfExists('test_storage');
        await schema.createTableIfNotExists('test_storage', table => {
            table.increments();
            table.string('key');
            table.string('value');
            table.integer('created_at');
        });
    }

    async fusionActivated(context) {
        await super.fusionActivated(context);
        await this.buildSchema();
    }

    async beforeEach() {
        this.serializer = await this.container.make(SerializerInterface);
        this.databaseStorageAdapter = new DatabaseStorageAdapter(
            this.dbm.connection(),
            this.serializer
        );
        this.databaseStorageAdapter
            .setTable('test_storage')
            .setDefaultTTL(24*60*60*1000)
        ;
        this.clock = sinon.useFakeTimers();

        await this.dbm.from('test_storage').truncate();
    }

    async afterEach() {
        await this.dbm.from('test_storage').truncate();
        this.serializer = null;
        this.databaseStorageAdapter = null;
        this.clock.restore();
    }

    @testCase()
    async testSetAValueSuccessful() {
        await this.databaseStorageAdapter.set('foo', 'bar');
        assert(await this.dbm.from('test_storage').where('key', '=', 'foo').first());
    }

    @testCase()
    async testGetAValueSuccessful() {
        await this.dbm.from('test_storage').insert({
            key: 'foo',
            value: this.serializer.serialize({
                'hello': 'world'
            }),
            created_at: new Date().getTime()
        });
        assert.deepEqual({'hello': 'world'}, await this.databaseStorageAdapter.get('foo'));
    }

    @testCase()
    async testUnsetAValueSuccessful() {
        await this.dbm.from('test_storage').insert({
            key: 'foo',
            value: this.serializer.serialize({
                'hello': 'world'
            }),
            created_at: new Date().getTime()
        });

        await this.databaseStorageAdapter.unset('foo');

        assert.isNotOk(await this.dbm.from('test_storage').where('key', '=', 'foo').first());
    }

    @testCase()
    async testWhenTheValueIsExpiredTime() {
        let ttl = 10;
        await this.dbm.from('test_storage').insert({
            key: 'foo',
            value: this.serializer.serialize({
                'hello': 'world'
            }),
            created_at: new Date().getTime()
        });

        this.clock.tick(ttl + 5000);

        assert.isNull(await this.databaseStorageAdapter.get('foo', null, {
            ttl: ttl
        }));

    }
}