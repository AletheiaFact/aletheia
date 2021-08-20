import * as mongoose from "mongoose";

const claimReviewSchema = new mongoose.Schema({
    classification: {
        type: String,
        required: true,
        validate: {
            validator: (v) => {
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
                        "unverifiable",
                    ].indexOf(v) !== -1
                );
            },
        },
        message: (tag) => `${tag} is not a valid classification.`,
    },
    claim: {
        type: mongoose.Types.ObjectId,
        ref: "Claim",
        required: true,
    },
    personality: {
        type: mongoose.Types.ObjectId,
        ref: "Personality",
        required: true,
    },
    sentence_hash: {
        type: String,
        required: true,
    },
    sentence_content: {
        type: String,
        required: true,
    },
    sources: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Source",
        },
    ],
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    // TODO: user_id
    // TODO: revision_id
});

module.exports = mongoose.model("ClaimReview", claimReviewSchema);
