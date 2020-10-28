import ClaimController from "../api/controller/claimController";
const Requester = require("../infra/interceptor/requester");

/**
 * The main router object
 */
const router = require("../lib/util").router();

let app;

/**
 * POST {domain}/claim
 */
router.post("/", (req, res, next) => {
    const claim = new ClaimController(app);
    claim
        .create(req.body)
        .then(result => res.send(result))
        .catch(error => {
            next(Requester.internalError(res, error.message));
        });
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
router.put("/:id", (req, res, next) => {
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
router.delete("/:id", (req, res, next) => {
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
