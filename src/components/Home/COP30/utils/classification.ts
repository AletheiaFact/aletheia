export const classificationMap = {
    trustworthy: "confiavel",
    trustworthyBut: "confiavel",

    misleading: "enganoso",
    false: "enganoso",
    unsustainable: "enganoso",
    exaggerated: "enganoso",
    unverifiable: "enganoso",

    arguable: "emAnalise",
    notFact: "emAnalise",
};

export function buildStats(sentences: Array<{ classification: string }>) {
    const stats = {
        total: sentences.length,
        confiavel: 0,
        enganoso: 0,
        emAnalise: 0,
    };
    for (const sentence of sentences) {
        const group = classificationMap[sentence.classification];

        if (group) {
            stats[group] += 1;
        }
    }
    return stats;
}
