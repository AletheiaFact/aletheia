import * as mongoose from "mongoose";

const claimSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: Object,
        required: true
    },
    type: {
        type: String,
        required: true,
        validate: {
            validator: v => {
                return ["speech", "twitter"].indexOf(v) !== -1;
            }
        },
        message: tag => `${tag} is not a valid claim type.`
    },
    date: {
        type: Date,
        required: true
    },
    personality: {
        type: mongoose.Schema.ObjectId,
        ref: "Personality",
        required: true
    },
    claimReviews: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "ClaimReview"
        }
    ],
    sources: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Source"
        }
    ]
});

module.exports = mongoose.model("Claim", claimSchema);
