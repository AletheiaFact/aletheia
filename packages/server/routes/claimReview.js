'use strict';

const claimReview = require('../api/controller/claimReviewController');

/**
 * The main router object
 */
const router = require('../lib/util').router();

/**
 * GET {domain}/claim
 */
router.get('/', claimReview.listAll);

/**
 * POST {domain}/claim
 */
router.post('/', claimReview.create);

/**
 * GET {domain}/claim{/id}
 */
router.get('/:id', claimReview.getClaimReviewId);

/**
 * PUT {domain}/claim{/id}
 * Do not allow claimReview to be updated in the prototype
 * this functionality requires better specifications
 */
// router.put('/:id', claimReview.update);

/**
 * DELETE {domain}/claim{/id}
 */
router.delete('/:id', claimReview.delete);

module.exports = function(appObj) {
    return {
        path: '/claimreview',
        api_version: 1,
        router
    };
};
