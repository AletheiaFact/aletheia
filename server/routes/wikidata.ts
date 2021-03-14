import WikidataResolver from "../lib/wikidataResolver";
const Requester = require("../infra/interceptor/requester");

/**
 * The main router object
 */
const router = require("../lib/util").router();

router.get("/:wikidataId", (req, res, next) => {
    const wikidata = new WikidataResolver();

    wikidata
        .fetchProperties({ ...req.params, ...req.query })
        .then(props => {
            // Check if personality already exists
            res.send({ ...props });
        })
        .catch(error => {
            next(Requester.internalError(res, error.message));
        });
});

module.exports = function(appObj) {
    return {
        path: "/wikidata",
        api_version: 1,
        router
    };
};
