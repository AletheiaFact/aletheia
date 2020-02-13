const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const personalitySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    wikidata: {
        type: String
    },
    claims: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Claim"
        }
    ]
});

module.exports = mongoose.model("Personality", personalitySchema);
