'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const claimSchema = new Schema({
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
    },
    claimReviews: [{
        type: mongoose.Schema.ObjectId,
        ref: 'ClaimReview',
    }]
});

module.exports = mongoose.model('Claim', claimSchema);
