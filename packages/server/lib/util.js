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

module.exports = {
    router: createRouter
};
