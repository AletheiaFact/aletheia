const ReferenceController = require("../api/controller/referrence");
const Requester = require("../infra/interceptor/requester");

/**
 * The main router object
 */
const router = require("../lib/util").router();

/**
 * GET {domain}/reference
 */
router.get("/", (req, res, next) => {
    const reference = new ReferenceController();
    reference
        .listAll()
        .then(result => res.send(result))
        .catch(error => {
            next(Requester.internalError(res, error.message));
        });
});

/**
 * POST {domain}/reference
 */
router.post("/", (req, res, next) => {
    const reference = new ReferenceController();
    reference
        .create(req.body)
        .then(result => res.send(result))
        .catch(error => {
            next(Requester.internalError(res, error.message));
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
            next(Requester.internalError(res, error.message));
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
            next(Requester.internalError(res, error.message));
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
            next(Requester.internalError(res, error.message));
        });
});

module.exports = function(appObj) {
    return {
        path: "/reference",
        api_version: 1,
        router
    };
};
