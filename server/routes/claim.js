import ClaimController from "../api/controller/claimController";

const captcha = require("../lib/captcha");
const ensureLoggedIn = require("../api/middleware/ensureLoggedIn");
const Requester = require("../infra/interceptor/requester");

/**
 * The main router object
 */
const router = require("../lib/util").router();

let app;

/**
 * GET {domain}/personality
 */
router.get("/", (req, res, next) => {
    const claim = new ClaimController(app);
    claim
        .listAll(req.query)
        .then(result => res.send(result))
        .catch(error => {
            next(Requester.internalError(res, error.message, app.logger));
        });
});

/**
 * POST {domain}/claim
 */
router.post("/", ensureLoggedIn, async (req, res, next) => {
    const claim = new ClaimController(app);

    const recaptchaCheck = await captcha.checkResponse(
        app.config.recaptcha_secret,
        req.body && req.body.recaptcha
    );

    if (!recaptchaCheck.success) {
        app.logger.log("error/recaptcha", recaptchaCheck);
        next(
            Requester.internalError(res, "Error with your reCaptcha response")
        );
    } else {
        claim
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
    const claim = new ClaimController(app);
    claim
        .getClaimId(req.params.id)
        .then(result => res.send(result))
        .catch(error => {
            next(Requester.internalError(res, error.message));
        });
});

/**
 * PUT {domain}/claim{/id}
 */
router.put("/:id", ensureLoggedIn, (req, res, next) => {
    const claim = new ClaimController(app);
    claim
        .update(req.params.id, req.body)
        .then(result => res.send(result))
        .catch(error => {
            next(Requester.internalError(res, error.message));
        });
});

/**
 * DELETE {domain}/claim{/id}
 */
router.delete("/:id", ensureLoggedIn, (req, res, next) => {
    const claim = new ClaimController(app);
    claim
        .delete(req.params.id)
        .then(result => res.send(result))
        .catch(error => {
            next(Requester.internalError(res, error.message));
        });
});

module.exports = function(appObj) {
    app = appObj;
    return {
        path: "/claim",
        api_version: 1,
        router
    };
};
