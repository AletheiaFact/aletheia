import * as mongoose from "mongoose";

const referenceSchema = new mongoose.Schema({
    link: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    type: {
        type: String,
        required: true,
        validate: {
            validator: v => {
                return ["claim", "claim_review"].indexOf(v) !== -1;
            }
        },
        message: tag => `${tag} is not a valid type.`
    },
    classification: {
        type: String,
        required: true,
        validate: {
            validator: v => {
                return ["reliable", "unreliable", "fake"].indexOf(v) !== -1;
            }
        },
        message: tag => `${tag} is not a valid classification.`
    },
    claim: {
        type: mongoose.Schema.ObjectId,
        ref: "Claim"
    },
    claimReview: {
        type: mongoose.Schema.ObjectId,
        ref: "ClaimReview"
    }
    // TODO user_id
});

module.exports = mongoose.model("Reference", referenceSchema);
