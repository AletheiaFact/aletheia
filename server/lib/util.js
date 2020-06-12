const express = require("express");

/**
 * Creates a new router with some default options.
 * @param {?Object} [opts] additional options to pass to express.Router()
 * @return {!Router} a new router object
 */
function createRouter(opts) {
    const options = {
        mergeParams: true
    };

    if (opts && opts.constructor === Object) {
        Object.assign(options, opts);
    }

    return new express.Router(options);
}

function formatStats(reviews, slice = false) {
    const total = reviews.reduce((agg, review) => {
        agg += review.count;
        return agg;
    }, 0);
    const result = reviews.map(review => {
        const percentage = (review.count / total) * 100;
        return {
            _id: review._id,
            percentage: percentage.toFixed(0),
            count: review.count
        };
    });
    return { total, reviews: slice ? result.slice(0, 3) : result };
}
module.exports = {
    router: createRouter,
    formatStats
};
