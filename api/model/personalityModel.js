'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const personalitySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Personality', personalitySchema);
