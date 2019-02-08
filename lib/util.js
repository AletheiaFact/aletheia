'use strict';

const express = require('express');
const bodyParser = require("body-parser");

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

    const router = new express.Router(options);

    // Manipulate router after creating it
    router.use(bodyParser.urlencoded({ extended: false }));
    router.use(bodyParser.json());

    return router;
}

module.exports = {
    router: createRouter
};
