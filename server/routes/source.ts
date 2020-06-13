const SourceController = require("../api/controller/sourceController");
const Requester = require("../infra/interceptor/requester");

/**
 * The main router object
 */
const router = require("../lib/util").router();

let app;

/**
 * POST {domain}/source
 */
router.post("/", (req, res, next) => {
    const source = new SourceController();

    source
        .create(req.body)
        .then(result => res.send(result))
        .catch(error => {
            next(Requester.internalError(res, error.message, app.logger));
        });
});

/**
 * GET {domain}/source{/id}
 */
router.get("/:id", (req, res, next) => {
    const source = new SourceController();
    source
        .getsourceId(req.params.id)
        .then(result => res.send(result))
        .catch(error => {
            next(Requester.internalError(res, error.message, app.logger));
        });
});

/**
 * PUT {domain}/source{/id}
 */
router.put("/:id", (req, res, next) => {
    const source = new SourceController();
    source
        .update(req.params.id, req.body)
        .then(result => res.send(result))
        .catch(error => {
            next(Requester.internalError(res, error.message, app.logger));
        });
});

/**
 * DELETE {domain}/source{/id}
 */
router.delete("/:id", (req, res, next) => {
    const source = new SourceController();
    source
        .delete(req.params.id)
        .then(result => res.send(result))
        .catch(error => {
            next(Requester.internalError(res, error.message, app.logger));
        });
});

module.exports = function(appObj) {
    app = appObj;
    return {
        path: "/source",
        api_version: 1,
        router
    };
};
