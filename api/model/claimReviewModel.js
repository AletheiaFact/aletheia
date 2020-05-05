const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const claimReviewSchema = new Schema({
    classification: {
        type: String,
        required: true,
        validate: {
            validator: v => {
                return (
                    [
                        "not-fact",
                        "true",
                        "true-but",
                        "arguable",
                        "misleading",
                        "false",
                        "unsustainable",
                        "exaggerated",
                        "unverifiable"
                    ].indexOf(v) !== -1
                );
            }
        },
        message: tag => `${tag} is not a valid classification.`
    },
    claim: {
        type: mongoose.Schema.ObjectId,
        ref: "Claim",
        required: true
    },
    personality: {
        type: mongoose.Schema.ObjectId,
        ref: "Personality",
        required: true
    },
    sentence_hash: {
        type: String,
        required: true
    },
    sentence_content: {
        type: String,
        required: true
    }
    // TODO: user_id
    // TODO: user_agent
    // TODO: reference
    // TODO: revision_id
});

module.exports = mongoose.model("ClaimReview", claimReviewSchema);
