'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var candidateSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  speech: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Candidate', candidateSchema);