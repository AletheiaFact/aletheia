const ReferenceController = require("../api/controller/referenceController");
const Requester = require("../infra/interceptor/requester");

/**
 * The main router object
 */
const router = require("../lib/util").router();

let app;

/**
 * POST {domain}/reference
 */
router.post("/", (req, res, next) => {
    const reference = new ReferenceController();

    reference
        .create(req.body)
        .then(result => res.send(result))
        .catch(error => {
            next(Requester.internalError(res, error.message, app.logger));
        });
});

/**
 * GET {domain}/reference{/id}
 */
router.get("/:id", (req, res, next) => {
    const reference = new ReferenceController();
    reference
        .getReferenceId(req.params.id)
        .then(result => res.send(result))
        .catch(error => {
            next(Requester.internalError(res, error.message, app.logger));
        });
});

/**
 * PUT {domain}/reference{/id}
 */
router.put("/:id", (req, res, next) => {
    const reference = new ReferenceController();
    reference
        .update(req.params.id, req.body)
        .then(result => res.send(result))
        .catch(error => {
            next(Requester.internalError(res, error.message, app.logger));
        });
});

/**
 * DELETE {domain}/reference{/id}
 */
router.delete("/:id", (req, res, next) => {
    const reference = new ReferenceController();
    reference
        .delete(req.params.id)
        .then(result => res.send(result))
        .catch(error => {
            next(Requester.internalError(res, error.message, app.logger));
        });
});

module.exports = function(appObj) {
    app = appObj;
    return {
        path: "/reference",
        api_version: 1,
        router
    };
};
