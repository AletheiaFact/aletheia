const Claim = require("../api/model/claimModel");
const Personality = require("../api/model/personalityModel");
const ClaimReview = require("../api/model/claimReviewModel");
const Requester = require("../infra/interceptor/requester");

/**
 * The main router object
 */
const router = require("../lib/util").router();

let app;

/**
 * GET {domain}/stats
 */
router.get("/home", (req, res, next) => {
    Promise.all([Claim.count(), Personality.count(), ClaimReview.count()])
        .then(values => {
            res.send({
                claims: values[0],
                personalities: values[1],
                reviews: values[2]
            });
        })
        .catch(e => {
            Requester.internalError(e, "Error while fetching stats");
        });
});

module.exports = function(appObj) {
    app = appObj;
    return {
        path: "/stats",
        api_version: 1,
        router
    };
};
