'use strict';

const Parser = require('../lib/parser');

/**
 * The main router object
 */
const router = require('../lib/util').router();

/**
 * GET {domain}/candidate
 */
router.get('/', (req, res, next) => {

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const p = new Parser();
    const result = p.parse();
    res.json(result.object);
});

module.exports = function(appObj) {
    return {
        path: '/testparser',
        api_version: 1,
        router
    };
};
