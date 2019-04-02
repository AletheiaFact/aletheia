'use strict';

const personality = require('../api/controller/personalityController');

/**
 * The main router object
 */
const router = require('../lib/util').router();

/**
 * GET {domain}/personality
 */
router.get('/', personality.listAll);

/**
 * POST {domain}/personality
 */
router.post('/', personality.create);

/**
 * GET {domain}/personality{/id}
 */
router.get('/:id', personality.getPersonalityId);

/**
 * PUT {domain}/personality{/id}
 */
router.put('/:id', personality.update);

/**
 * DELETE {domain}/personality{/id}
 */
router.delete('/:id', personality.delete);

module.exports = function(appObj) {
    return {
        path: '/personality',
        api_version: 1,
        router
    };
};
