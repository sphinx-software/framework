class DatabaseExpirationStrategy {

    queryForNotExpired(query) {
        return query.where('expired_at', '>=', new Date().getTime());
    }

    queryForExpired(query) {
        return query.where('expired_at', '<', new Date().getTime());
    }

    calculateExpiredTime(ttl) {
        return new Date().getTime() + ttl;
    }
}

module.exports = DatabaseExpirationStrategy;