'use strict'
const candidate = require('./candidateRoute')

const routes = server => {
  candidate(server)
}

module.exports = routes
