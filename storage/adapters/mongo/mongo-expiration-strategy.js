class MongoExpirationStrategy {

    queryForNotExpired(spec) {
        return spec['expiredAt'] = {
            '$gte': new Date().getTime(),
        };
    }

    queryForExpired(spec) {
        return spec['expiredAt'] = {
            '$lt': new Date().getTime(),
        };
    }

    calculateExpiredTime(ttl) {
        return new Date().getTime() + ttl;
    }
}

module.exports = MongoExpirationStrategy;