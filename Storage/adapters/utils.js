const expiredDateFrom = (date, ttl) => {
    return new Date(date.getTime() + ttl);
};

const expiredDateFromNow = (ttl) => {
    return exports.expiredDateFrom(new Date(), ttl);
};

const isExpired = (expiredDate) => {
    return Date.now() > expiredDate.getTime();
};

const isNotExpired = (expiredDate) => {
    return !exports.isExpired(expiredDate);
};

export default { expiredDateFrom, expiredDateFromNow, isExpired, isNotExpired };
