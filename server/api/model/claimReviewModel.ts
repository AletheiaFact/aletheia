import * as mongoose from "mongoose";

const claimReviewSchema = new mongoose.Schema({
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
    },
    sources: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Source"
        }
    ]
    // TODO: user_id
    // TODO: user_agent
    // TODO: revision_id
});

module.exports = mongoose.model("ClaimReview", claimReviewSchema);
