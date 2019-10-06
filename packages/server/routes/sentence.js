'use strict';
const mongoose = require(`mongoose`);

/**
 * The main router object
 */
const router = require('../lib/util').router();

/**
 * GET {domain}/claim{/id}
 */
router.get('/:sentence_hash', (req, res) => {
    const { sentence_hash } = req.params;
    ClaimReview.aggregate([
        { $match: { sentence_hash }},
        { $group: { _id: "$classification", count: { $sum: 1 } } },
    ])
    .then((review) => {
        res.json(review)
    });
});

module.exports = function(appObj) {
    return {
        path: '/sentence',
        api_version: 1,
        router
    };
};
