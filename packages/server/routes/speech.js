'use strict';

const speech = require('../api/controller/speechController');

/**
 * The main router object
 */
const router = require('../lib/util').router();

/**
 * GET {domain}/speech
 */
router.get('/', speech.listAll);

/**
 * POST {domain}/speech
 */
router.post('/', speech.create);

/**
 * GET {domain}/speech{/id}
 */
router.get('/:id', speech.getSpeechId);

/**
 * PUT {domain}/speech{/id}
 */
router.put('/:id', speech.update);

/**
 * DELETE {domain}/speech{/id}
 */
router.delete('/:id', speech.delete);

module.exports = function(appObj) {
    return {
        path: '/speech',
        api_version: 1,
        router
    };
};
