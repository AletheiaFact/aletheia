const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const supportReferenceSchema = new Schema({
    link: {
        type: String,
        required: true
    },
    citation: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    classification: {
        type: String
    },
    claim: {
        type: mongoose.Schema.ObjectId,
        ref: "Claim"
    },
    claimReviews: {
        type: mongoose.Schema.ObjectId,
        ref: "ClaimReview"
    }
    // TODO user_id
});

module.exports = mongoose.model("SupportReference", supportReferenceSchema);
