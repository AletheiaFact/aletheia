'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const personalitySchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        birthday: { type: String },
        relationship: { type: String },
        job: { type: String }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('personality', personalitySchema);
