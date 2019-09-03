'use strict';

const Claim = require('../api/controller/claimController');
const Requester = require('../infra/interceptor/requester');

/**
 * The main router object
 */
const router = require('../lib/util').router();

/**
 * GET {domain}/claim
 */
router.get('/', (req, res, next) => {
    const claim = new Claim();
    claim.listAll()
    .then(result => res.send(result))
    .catch((error) => {
        next(Requester.internalError(res, error.message));
    });
});

/**
 * POST {domain}/claim
 */
router.post('/', (req, res, next) => {
    const claim = new Claim();
    claim.create(req.body)
    .then(result => res.send(result))
    .catch((error) => {
        next(Requester.internalError(res, error.message));
    });
});

/**
 * GET {domain}/claim{/id}
 */
router.get('/:id', (req, res, next) => {
    const claim = new Claim();
    claim.getClaimId(req.params.id)
    .then(result => res.send(result))
    .catch((error) => {
        next(Requester.internalError(res, error.message));
    });
});

/**
 * PUT {domain}/claim{/id}
 */
router.put('/:id', (req, res, next) => {
    const claim = new Claim();
    claim.update(req.params.id, req.body)
    .then(result => res.send(result))
    .catch((error) => {
        next(Requester.internalError(res, error.message));
    });
});

/**
 * DELETE {domain}/claim{/id}
 */
router.delete('/:id', (req, res, next) => {
    const claim = new Claim();
    claim.delete(req.params.id)
    .then(result => res.send(result))
    .catch((error) => {
        next(Requester.internalError(res, error.message));
    });
});

module.exports = function(appObj) {
    return {
        path: '/claim',
        api_version: 1,
        router
    };
};
