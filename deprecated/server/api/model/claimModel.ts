import * as mongoose from "mongoose";

const claimSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: Object,
        required: true,
    },
    type: {
        type: String,
        required: true,
        validate: {
            validator: (v) => {
                return ["speech", "twitter"].indexOf(v) !== -1;
            },
        },
        message: (tag) => `${tag} is not a valid claim type.`,
    },
    date: {
        type: Date,
        required: true,
    },
    personality: {
        type: mongoose.Types.ObjectId,
        ref: "Personality",
        required: true,
    },
    claimReviews: [
        {
            type: mongoose.Types.ObjectId,
            ref: "ClaimReview",
        },
    ],
    sources: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Source",
        },
    ],
});

module.exports = mongoose.model("Claim", claimSchema);
