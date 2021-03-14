import UserRepository from "../api/repository/user";
const Requester = require("../infra/interceptor/requester");
const ensureLoggedIn = require("../api/middleware/ensureLoggedIn");
const passport = require("passport");
/**
 * The main router object
 */
const router = require("../lib/util").router();

let app;

/**
 * POST {domain}/signin
 */
router.post("/signin", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(Requester.authError(res, err.message, app.logger));
        if (!user)
            return next(Requester.authError(res, info.message, app.logger));
        req.logIn(user, function(err) {
            if (err)
                return next(Requester.authError(res, err.message, app.logger));
            return res.send({ success: true });
        });
    })(req, res, next);
});

router.get("/validate", ensureLoggedIn, (req, res, next) => {
    res.send({ success: true });
});

/**
 * TODO: this endpoint won't be publicly available
 * POST {domain}/signup
 */
router.post("/signup", async (req, res, next) => {
    const userRepository = new UserRepository(app.logger);
    try {
        await userRepository.register(req.body);
        passport.authenticate("local")(req, res, function() {
            const prevSession = req.session;
            req.session.regenerate(err => {
                if (err) {
                    throw err;
                } else {
                    Object.assign(req.session, prevSession);
                    res.send({ success: true });
                }
            });
        });
    } catch (e) {
        next(Requester.internalError(res, e.message, app.logger));
    }
});

module.exports = function(appObj) {
    app = appObj;
    return {
        path: "/user",
        api_version: 1,
        router
    };
};
