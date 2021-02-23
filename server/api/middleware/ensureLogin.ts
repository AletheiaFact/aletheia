import Requester from "../../infra/interceptor/requester";

module.exports = function ensureLoggedIn() {
    return function(req, res, next) {
        if (!req.isAuthenticated || !req.isAuthenticated()) {
            return Requester.authError(
                res,
                "User not authenticated",
                req.app.logger
            );
        } else {
            next();
        }
    };
};
