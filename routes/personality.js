'use strict';

const personality = require('../api/controller/personalityController');
const bodyParser = require("body-parser");

/**
 * The main router object
 */
const router = require('../lib/util').router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

/**
 * GET {domain}/personality
 */
router.get('/', personality.listAll);

/**
 * POST {domain}/personality
 */
router.post('/', personality.create);
/**
 * GET {domain}/personality{/personalityId}
 */
router.get('/:personalityId', personality.getPersonalityId);

/**
 * PUT {domain}/personality{/personalityId}
 */
router.put('/:personalityId', personality.update);

/**
 * DELETE {domain}/personality{/personalityId}
 */
router.delete('/:personalityId', personality.delete);

module.exports = function(appObj) {
    return {
        path: '/personality',
        api_version: 1,
        router
    };
};
