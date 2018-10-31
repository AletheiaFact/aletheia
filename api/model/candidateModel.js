'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const candidateSchema = new Schema({
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
