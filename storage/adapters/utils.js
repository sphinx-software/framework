exports.expiredDateFrom = (date, ttl) => {
    return new Date(date.getTime() + ttl);
};

exports.expiredDateFromNow = (ttl) => {
    return exports.expiredDateFrom(new Date(), ttl);
};

exports.isExpired = (expiredDate) => {
    return Date.now() > expiredDate.getTime();
};

exports.isNotExpired = (expiredDate) => {
    return ! exports.isExpired(expiredDate);
};
