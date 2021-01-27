const Requester = require("../infra/interceptor/requester");
const passport = require("passport");
const User = require("../api/model/userModel");
/**
 * The main router object
 */
const router = require("../lib/util").router();

let app;

/**
 * POST {domain}/signin
 */
router.post("/signin", passport.authenticate("local"), (req, res, next) => {
    console.log("yo");
    res.send({ status: "signin success" });
});

/**
 * POST {domain}/signup
 */
router.post("/signup", (req, res, next) => {
    User.register(
        new User({
            email: req.body.email
        }),
        req.body.password,
        function(error) {
            if (error) {
                next(Requester.internalError(res, error.message, app.logger));
            }

            passport.authenticate("local")(req, res, function() {
                res.send({ status: "success" });
            });
        }
    );
});

module.exports = function(appObj) {
    app = appObj;
    return {
        path: "/user",
        api_version: 1,
        router
    };
};
