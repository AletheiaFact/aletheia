import SourceController from "../api/controller/sourceController";
const ensureLoggedIn = require("../api/middleware/ensureLoggedIn");
const Requester = require("../infra/interceptor/requester");

/**
 * The main router object
 */
const router = require("../lib/util").router();

let app;

/**
 * POST {domain}/source
 */
router.post("/", ensureLoggedIn, (req, res, next) => {
    const source = new SourceController(app);

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
    const source = new SourceController(app);
    source
        .getSourceId(req.params.id)
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            next(Requester.internalError(res, error.message, app.logger));
        });
});

/**
 * PUT {domain}/source{/id}
 */
router.put("/:id", ensureLoggedIn, (req, res, next) => {
    const source = new SourceController(app);
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
router.delete("/:id", ensureLoggedIn, (req, res, next) => {
    const source = new SourceController(app);
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
