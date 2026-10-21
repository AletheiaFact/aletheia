import {
    annotateClaimContent,
    calculateOverallStats,
    deriveClaimSlug,
    getClaimContent,
    transformContentObject,
} from "./claim.rules";

const sentence = (data_hash: string) => ({
    data_hash,
    props: { id: 1 },
    content: "text",
});
const paragraphs = () => [
    { content: [sentence("aaa"), sentence("bbb")] },
    { content: [sentence("ccc")] },
];

describe("claim shared rules", () => {
    it("deriveClaimSlug lowercases and strips special characters", () => {
        expect(deriveClaimSlug("Olá, Mundo! 2024")).toBe("ola-mundo-2024");
    });

    it("getClaimContent unwraps speech and unattributed one level deeper", () => {
        const paras = paragraphs();
        expect(
            getClaimContent({
                contentModel: "Speech",
                content: [{ content: paras }],
            })
        ).toBe(paras);
        expect(
            getClaimContent({
                contentModel: "Unattributed",
                content: [{ content: paras }],
            })
        ).toBe(paras);
        const image = { type: "Image", data_hash: "x" };
        expect(
            getClaimContent({ contentModel: "Image", content: [image] })
        ).toBe(image);
    });

    it("transformContentObject returns the input untouched without reviews or tasks", () => {
        const paras = paragraphs();
        expect(transformContentObject(paras, [], [])).toBe(paras);
        expect(transformContentObject(null, [], [])).toBeNull();
    });

    it("transformContentObject annotates sentences from reviews, then tasks", () => {
        const paras = paragraphs();
        const out = transformContentObject(
            paras,
            [{ _id: { data_hash: "aaa", classification: ["true"] } }],
            [{ data_hash: "ccc" }]
        );
        expect(out[0].content[0].props.classification).toBe("true");
        expect(out[0].content[1].props.classification).toBeUndefined();
        expect(out[1].content[0].props.classification).toBe("in-progress");
    });

    it("transformContentObject annotates an image from its review", () => {
        const image = { type: "Image", data_hash: "img", props: { key: "k" } };
        const out = transformContentObject(
            image,
            [{ _id: { data_hash: "img", classification: ["false"] } }],
            []
        );
        expect(out.props).toEqual({ key: "k", classification: "false" });
    });

    it("annotateClaimContent maps over every speech of a debate", () => {
        const claim = {
            contentModel: "Debate",
            content: { content: [{ content: paragraphs() }] },
        };
        const out = annotateClaimContent(
            claim,
            [{ _id: { data_hash: "bbb", classification: ["misleading"] } }],
            []
        );
        expect(
            out.content.content[0].content[0].content[1].props.classification
        ).toBe("misleading");
    });

    it("calculateOverallStats counts sentences and reviewed sentences", () => {
        const paras = paragraphs();
        paras[1].content[0].props = { id: 1, classification: "true" } as any;
        expect(
            calculateOverallStats({ contentModel: "Speech", content: paras })
        ).toEqual({ totalClaims: 3, totalClaimsReviewed: 1 });
        expect(
            calculateOverallStats({
                contentModel: "Image",
                content: { props: { classification: "false" } },
            })
        ).toEqual({ totalClaims: 1, totalClaimsReviewed: 1 });
        expect(calculateOverallStats({})).toEqual({
            totalClaims: 0,
            totalClaimsReviewed: 0,
        });
    });
});
