'use strict';

const claim = require('../api/controller/claimController');

/**
 * The main router object
 */
const router = require('../lib/util').router();

/**
 * GET {domain}/claim
 */
router.get('/', claim.listAll);

/**
 * POST {domain}/claim
 */
router.post('/', claim.create);

/**
 * GET {domain}/claim{/id}
 */
router.get('/:id', claim.getclaimId);

/**
 * PUT {domain}/claim{/id}
 */
router.put('/:id', claim.update);

/**
 * DELETE {domain}/claim{/id}
 */
router.delete('/:id', claim.delete);

module.exports = function(appObj) {
    return {
        path: '/claim',
        api_version: 1,
        router
    };
};
