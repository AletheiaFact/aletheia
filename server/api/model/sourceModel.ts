import * as mongoose from "mongoose";

/**
 * Use Dynamic ref https://mongoosejs.com/docs/populate.html#dynamic-ref
 */
const sourceSchema = new mongoose.Schema({
    link: {
        type: String,
        required: true
    },
    classification: {
        type: String,
        validate: {
            validator: v => {
                return (
                    ["unclassified", "reliable", "unreliable", "fake"].indexOf(
                        v
                    ) !== -1
                );
            }
        },
        message: tag => `${tag} is not a valid classification.`
    },
    description: {
        type: String
    },
    targetId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        refPath: "onModel"
    },
    targetModel: {
        type: String,
        required: true,
        enum: ["Claim", "ClaimReview"]
    }
    // TODO user_id
});

module.exports = mongoose.model("Source", sourceSchema);
