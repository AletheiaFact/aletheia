'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const candidateSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: Object,
        required: true
    },
    personality: {
        type: mongoose.Schema.ObjectId,
        ref: 'Personality',
        required: true
    }
});

module.exports = mongoose.model('Speech', candidateSchema);
