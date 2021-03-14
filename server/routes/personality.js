import { PersonalityController } from "../api/controller/personalityController";
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
    const personality = new PersonalityController(app);
    personality
        .listAll(req.query)
        .then(result => res.send(result))
        .catch(error => {
            next(Requester.internalError(res, error.message, app.logger));
        });
});

/**
 * POST {domain}/personality
 */
router.post("/", ensureLoggedIn, (req, res, next) => {
    const personality = new PersonalityController(app);
    personality
        .create(req.body)
        .then(result => res.send(result))
        .catch(error => {
            if (
                error.name === "MongoError" &&
                error.keyPattern &&
                error.keyPattern.wikidata
            ) {
                error.message = `Personality with wikidata id ${error.keyValue.wikidata} already exists`;
            }
            next(Requester.internalError(res, error.message, app.logger));
        });
});

/**
 * GET {domain}/personality{/id}
 */
router.get("/:id", (req, res, next) => {
    const personality = new PersonalityController(app);
    personality
        .getPersonalityId(req.params.id, req.query.language)
        .then(async result => {
            res.send(result);
        })
        .catch(error => {
            next(Requester.internalError(res, error.message, app.logger));
        });
});

/**
 * GET {domain}/personality{/id}/reviews
 */
router.get("/:id/reviews", (req, res, next) => {
    const personality = new PersonalityController(app);

    personality
        .getReviewStats(req.params.id)
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            next(Requester.internalError(res, error.message, app.logger));
        });
});

/**
 * PUT {domain}/personality{/id}
 */
router.put("/:id", ensureLoggedIn, (req, res, next) => {
    const personality = new PersonalityController(app);
    personality
        .update(req.params.id, req.body)
        .then(result => res.send(result))
        .catch(error => {
            next(Requester.internalError(res, error.message));
        });
});

/**
 * DELETE {domain}/personality{/id}
 */
router.delete("/:id", ensureLoggedIn, (req, res, next) => {
    const personality = new PersonalityController(app);
    personality
        .delete(req.params.id)
        .then(result => res.send(result))
        .catch(error => {
            next(Requester.internalError(res, error.message));
        });
});

module.exports = function(appObj) {
    app = appObj;
    return {
        path: "/personality",
        api_version: 1,
        router
    };
};
