'use strict';

const Parser = require('../lib/parser');
const fs = require('fs');
const path = require('path');
const Speech = require('../api/controller/speechController');

/**
 * The main router object
 */
const router = require('../lib/util').router();

const mockParser = () => {
    return fs.readFileSync(path.resolve('tests/parser', 'speech.html'), 'utf8');
}

/**
 * Handle CORS
 */
router.options("*",function(req,res,next){

    res.status(200).end();
});

/**
 * GET {domain}/candidate
 */
router.get('/', (req, res, next) => {
    
    const html = mockParser();
    const p = new Parser(html);
    const result = p.parse();
    res.json(result.object);
});

router.post('/', (req, res, next) => {
    
    const html = req.body.html;
    const p = new Parser(html);
    const content = p.parse();

    req.body = {
        content,
    };

    Speech.create(req,res,next);
});

module.exports = function(appObj) {
    return {
        path: '/testparser',
        api_version: 1,
        router
    };
};
