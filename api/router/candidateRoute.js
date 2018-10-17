'use strict';

const CandidateController = require('../controller/candidateController')

module.exports = function(app) {
  var candidate = require('../controller/candidateController');

  // Routes
  app.route('/candidate')
    .get(candidate.listAll)
    .post(candidate.create);


  app.route('/candidate/:taskId')
    .get(candidate.getCandidateId)
    .put(candidate.update)
    .delete(candidate.delete);
};

// module.exports = server => {
//     server.get({ path: '/candidate' }, getAll)
//     // server.get({ path: '/actions' }, findAll)
//     // server.get({ path: '/actions/:id' }, get)
//     // server.put({ path: '/actions/:id' }, update)
//     // server.del({ path: '/actions/:id' }, remove)
// }


// function getAll () {
//     CandidateController.listAll()
//         .then(result => res.send(result))
//         .catch(error => {})
// }