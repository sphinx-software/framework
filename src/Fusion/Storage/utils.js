export const expiredDateFrom = (date, ttl) => {
    return new Date(date.getTime() + ttl);
};

export const expiredDateFromNow = (ttl) => {
    return exports.expiredDateFrom(new Date(), ttl);
};

export const isExpired = (expiredDate) => {
    return Date.now() > expiredDate.getTime();
};

export const isNotExpired = (expiredDate) => {
    return !exports.isExpired(expiredDate);
};

