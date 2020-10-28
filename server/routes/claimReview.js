import ClaimReviewController from "../api/controller/claimReviewController";
const Requester = require("../infra/interceptor/requester");
const captcha = require("../lib/captcha");

/**
 * The main router object
 */
const router = require("../lib/util").router();

let app;

/**
 * POST {domain}/claim
 */
router.post("/", async (req, res, next) => {
    const claimReview = new ClaimReviewController(app);
    // TODO: re-enablle recaptcha server-side confirmation after the edit-a-thon
    // of 16/05/2020. Reason: we still need to figure out how to create
    // config.yaml in the production environment with proper secrets that can't
    // be leaked

    const recaptchaCheck = await captcha.checkResponse(
        app.config.recaptcha_secret,
        req.body && req.body.recaptcha
    );

    console.log(recaptchaCheck);

    if (!recaptchaCheck.success) {
        app.logger.log("error/recaptcha", recaptchaCheck);
        next(
            Requester.internalError(res, "Error with your reCaptcha response")
        );
    } else {
        claimReview
            .create(req.body)
            .then(result => res.send(result))
            .catch(error => {
                app.logger.log("error/create", error);
                next(Requester.internalError(res, error.message));
            });
    }
});

/**
 * GET {domain}/claim{/id}
 */
router.get("/:id", (req, res, next) => {
    const claimReview = new ClaimReviewController(app);
    claimReview
        .getClaimReviewId(req.params.id)
        .then(result => res.send(result))
        .catch(error => {
            app.logger.log("error/update", error);
            next(Requester.internalError(res, error.message));
        });
});

/**
 * DELETE {domain}/claim{/id}
 */
router.delete("/:id", (req, res, next) => {
    const claimReview = new ClaimReviewController(app);
    claimReview
        .delete(req.params.id)
        .then(result => res.send(result))
        .catch(error => {
            app.logger.log("error/delete", error);
            next(Requester.internalError(res, error.message));
        });
});

module.exports = function(appObj) {
    app = appObj;
    return {
        path: "/claimreview",
        api_version: 1,
        router
    };
};
