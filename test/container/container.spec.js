'use strict';

const Container = require('./../../container/index');
const chai      = require('chai');
const sinon     = require('sinon');
const EventEmitter = require('events').EventEmitter;

chai.use(require('chai-as-promised'));

const assert    = chai.assert;

describe('Container test suite', () => {

    let container = null;

    beforeEach(() => {
        container = new Container(new EventEmitter());
    });

    describe('binding a dependency', () => {

        it('should return bounded dependency', async () => {
            container.bind('foo', async () => 'bar');

            let resolved = await container.make('foo');

            assert.equal(resolved, 'bar');
        });

        it('should return a new reference of dependency for each time resolve', async () => {
            container.bind('ref', async () => {
                return {};
            });

            let ref1 = await container.make('ref');
            let ref2 = await container.make('ref');


            assert.notStrictEqual(ref1, ref2);
        });

        it('should throw binding exception when resolving not existed dependency', async () => {
            return assert.isRejected(
                container.make('notExisted'),
                Error,
                'E_CONTAINER: Could not resolve dependency [notExisted]'
            );
        });

        it('can resolve dependency deeply', async () => {
            container.bind('foo', async () => 'foo-dep');
            container.bind('bar', async (c) => {
                return {foo: await c.make('foo')};
            });


            let bar = await container.make('bar');

            assert.deepEqual(bar, {foo: 'foo-dep'});
        });

        it('can resolve dependency deeply regardless of binding order', async () => {

            container.bind('bar', async (c) => {
                return {foo: await c.make('foo')};
            });

            container.bind('foo', async () => 'foo-dep');

            let bar = await container.make('bar');

            assert.deepEqual(bar, {foo: 'foo-dep'});
        });
    });

    describe('binding a dependency as a singleton', () => {
        it('always return a single instance', async () => {
            container.singleton('ref', async () => {
                return {};
            });

            let ref1 = await container.make('ref');
            let ref2 = await container.make('ref');

            assert.strictEqual(ref1, ref2);
        });
    });

    describe('binding a dependency as a value', () => {
        it('don\'t need to resolve', async () => {
            container.value('foo', 'bar');

            assert.equal(await container.make('foo'), 'bar');
        })
    });

    describe('when resolve a dependency', () => {
        it('should fire an event before resolve', async () => {
            let callback = sinon.spy();

            container.bind('foo', async () => 'bar');

            container.making('foo', callback);

            await container.make('foo');

            assert(callback.calledOnce);

            await container.make('foo');

            assert(callback.calledTwice);
        });

        it('should fire an event after resolved a dependency, ' +
            'and pass it as the callback argument', async() => {

            let callback = sinon.spy();

            container.bind('foo', async () => 'bar');
            container.made('foo', callback);

            await container.make('foo');

            assert(callback.calledOnce);
            assert(callback.calledWithExactly('bar'));
        })
    })
});
