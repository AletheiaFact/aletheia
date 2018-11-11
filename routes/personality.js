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
 * GET {domain}/personality{/taskId}
 */
router.get('/:taskId', personality.getPersonalityId);

/**
 * PUT {domain}/personality{/taskId}
 */
router.put('/:taskId', personality.update);

/**
 * DELETE {domain}/personality{/taskId}
 */
router.delete('/:taskId', personality.delete);

module.exports = function(appObj) {
    return {
        path: '/personality',
        api_version: 1,
        router
    };
};
