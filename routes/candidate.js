'use strict';

const candidate = require('../api/controller/candidateController');

/**
 * The main router object
 */
const router = require('../lib/util').router();

/**
 * GET {domain}/candidate
 */
router.get('/', candidate.listAll);

/**
 * POST {domain}/candidate
 */
router.post('/', candidate.create);

/**
 * GET {domain}/candidate{/taskId}
 */
router.get('/candidate/:taskId', candidate.getCandidateId);

/**
 * PUT {domain}/candidate{/taskId}
 */
router.put('/candidate/:taskId', candidate.update);

/**
 * DELETE {domain}/candidate{/taskId}
 */
router.delete('/candidate/:taskId', candidate.delete);

module.exports = function(appObj) {
    return {
        path: '/candidate',
        api_version: 1,
        router
    };
};
