'use strict';

const ClaimReview = require('../model/claimReviewModel');

/**
 * The main router object
 */
const router = require('../lib/util').router();

/**
 * GET {domain}/sentencehash
 */
router.get('/:sentenceHash', (req, res) => {
    const { sentenceHash } = req.params;
    ClaimReview.aggregate([
        { $match: { sentenceHash } },
        { $group: { _id: "$classification", count: { $sum: 1 } } },
    ])
    .then((review) => {
        res.json(review);
    });
});

module.exports = function(appObj) {
    return {
        path: '/sentence',
        api_version: 1,
        router
    };
};
