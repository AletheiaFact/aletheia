'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const annotationSchema = new Schema({
    classification: {
        type: String,
        validate: {
            validator: function() {
                return [
                    'not-fact',
                    'true',
                    'true-but',
                    'arguable',
                    'misleading',
                    'false',
                    'unsustainable',
                    'exaggerated',
                    'unverifiable'
                ].indexOf() !== -1;
            }
        }
        message: tag => `${tag} is not a valid classification.`
    },
    speech: {
        type: mongoose.Schema.ObjectId,
        ref: 'Speech',
        required: true
    },
    sentence_hash: { // sentence hash 
        type: String,
        required: true
    },
    sentence_content: {
        type: String,
        required: true
    }
    // TODO: user_id
    // TODO: user_agent
    // TODO: revision_id
});

module.exports = mongoose.model('Annotation', annotationSchema);