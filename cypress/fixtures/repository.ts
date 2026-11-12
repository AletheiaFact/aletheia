// GET /api/review response for the repository's fact-checks tab. The
// Cypress run publishes no review, so the tab is stubbed with this shape.
const review = (index: number, classification: string, methodology: string) => ({
    content: {
        _id: `64b7f0c2e1a2b3c4d5e6f7${10 + index}`,
        data_hash: `repositoryhash${index}`,
        content: `Repository fact-check sentence ${index}.`,
        props: { classification, classificationMethodology: methodology },
        topics: [],
    },
    personality: {
        _id: "64b7f0c2e1a2b3c4d5e6f700",
        name: "Repository Personality",
        slug: "repository-personality",
        description: "public figure",
        avatar: "",
        isHidden: false,
    },
    claim: {
        contentModel: "Debate",
        date: "2026-10-23T00:00:00.000Z",
        slug: `repository-debate-${index}`,
        title: `Repository debate ${index}`,
        claimId: `64b7f0c2e1a2b3c4d5e6f7${20 + index}`,
    },
    reviewHref: `/personality/repository-personality/claim/repository-debate-${index}/sentence/repositoryhash${index}`,
    report: "64b7f0c2e1a2b3c4d5e6f730",
});

const repository = {
    reviews: {
        reviews: [
            review(1, "trustworthy", "rncd-debate"),
            review(2, "false", "rncd-debate"),
        ],
        totalReviews: 2,
        totalPages: 1,
        page: 0,
        pageSize: 12,
        contentModelCounts: { Debate: 2 },
    },
    // Matches no claim in the Cypress database
    unknownSearch: "zzqxw nothing matches",
};

export default repository;
