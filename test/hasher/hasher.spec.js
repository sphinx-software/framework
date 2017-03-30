'use strict';

const BcryptHasher = require('./../../hash/bcrypt-hasher');
const chai      = require('chai');
const bcrypt    = require('bcrypt');

const assert    = chai.assert;

describe('Hasher test suite', () => {

    let hasher = null;

    beforeEach(() => {
        hasher = new BcryptHasher(bcrypt);
        hasher.setRounds(10);
    });

    it('should hash and check back correctly', async () => {
        let hashed = await hasher.generate('test');

        assert(await hasher.check('test', hashed));
    });

    it('should hash and check back in case hashed is invalid', async () => {
        let hashed = await hasher.generate('test');

        assert.notOk(await hasher.check('test2', hashed));
    })
});
