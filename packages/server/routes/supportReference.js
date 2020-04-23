const SupportReferenceController = require("../api/controller/supportReferences");
const Requester = require("../infra/interceptor/requester");

/**
 * The main router object
 */
const router = require("../lib/util").router();

/**
 * GET {domain}/supportReference
 */
router.get("/", (req, res, next) => {
    const supportReference = new SupportReferenceController();
    supportReference
        .listAll()
        .then(result => res.send(result))
        .catch(error => {
            next(Requester.internalError(res, error.message));
        });
});

/**
 * POST {domain}/supportReference
 */
router.post("/", (req, res, next) => {
    const supportReference = new SupportReferenceController();
    supportReference
        .create(req.body)
        .then(result => res.send(result))
        .catch(error => {
            next(Requester.internalError(res, error.message));
        });
});

/**
 * GET {domain}/supportReference{/id}
 */
router.get("/:id", (req, res, next) => {
    const supportReference = new SupportReferenceController();
    supportReference
        .getSupportReferenceId(req.params.id)
        .then(result => res.send(result))
        .catch(error => {
            next(Requester.internalError(res, error.message));
        });
});

/**
 * PUT {domain}/supportReference{/id}
 */
router.put("/:id", (req, res, next) => {
    const supportReference = new SupportReferenceController();
    supportReference
        .update(req.params.id, req.body)
        .then(result => res.send(result))
        .catch(error => {
            next(Requester.internalError(res, error.message));
        });
});

/**
 * DELETE {domain}/supportReference{/id}
 */
router.delete("/:id", (req, res, next) => {
    const supportReference = new SupportReferenceController();
    supportReference
        .delete(req.params.id)
        .then(result => res.send(result))
        .catch(error => {
            next(Requester.internalError(res, error.message));
        });
});

module.exports = function(appObj) {
    return {
        path: "/supportReference",
        api_version: 1,
        router
    };
};
