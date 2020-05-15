const sUtil = require("../lib/util");
const swaggerUi = require("../lib/swagger-ui");

/**
 * The main router object
 */
const router = sUtil.router();

/**
 * The main application object reported when this module is require()d
 */
let app;

/**
 * GET /
 * Main entry point. Currently it only responds if the spec or doc query
 * parameter is given, otherwise lets the next middleware handle it
 */
router.get("/", (req, res, next) => {
    res.json({ status: "ok" });
});

module.exports = appObj => {
    app = appObj;

    return {
        path: "/health",
        skip_domain: true,
        router
    };
};
