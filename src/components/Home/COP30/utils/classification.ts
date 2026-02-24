export const classificationMap = {
    trustworthy: "reliable",
    trustworthyBut: "reliable",

    misleading: "deceptive",
    false: "deceptive",
    unsustainable: "deceptive",
    exaggerated: "deceptive",
    unverifiable: "deceptive",

    arguable: "underReview",
    notFact: "underReview",
};

export function buildStats(sentences: Array<{ classification?: string }>) {
    const normalizedSentences = Array.isArray(sentences) ? sentences : [];

    const stats = {
        total: normalizedSentences.length,
        reliable: 0,
        deceptive: 0,
        underReview: 0,
    };

    for (const sentence of normalizedSentences) {
        const classification = sentence.classification ?? "";
        const group = classificationMap[classification];

        if (group) {
            stats[group] += 1;
        }
    }

    return stats;
}
