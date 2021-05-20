import * as mongoose from "mongoose";

const wikidataCacheSchema = new mongoose.Schema({
    wikidataId: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    props: {
        type: Object,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

wikidataCacheSchema.index({ wikidataId: 1, language: 1 }, { unique: true });
wikidataCacheSchema.index(
    { createdAt: 1 },
    {
        expireAfterSeconds: 86400
    }
);
module.exports = mongoose.model("WikidataCache", wikidataCacheSchema);
