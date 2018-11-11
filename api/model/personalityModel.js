'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const personalitySchema = new Schema({
    name: {
        type: String
    },
    birthday: { type: String },
    relationship: { type: String },
    job: { type: String }
});

module.exports = mongoose.model('Personality', personalitySchema);
