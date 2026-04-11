import { ReviewSourceInput, ReviewSource } from "../../types/Review";
import { mergeSources } from "./actions";

describe("Unit Test: mergeSources", () => {

    it("should merge two sources correctly using the ID", () => {
        const base: ReviewSourceInput[] = [
            { id: "source-1", href: "old-link", field: "summary" }
        ];
        const schema: ReviewSourceInput[] = [
            { id: "source-1", href: "new-link", props: { textRange: [1, 15] } }
        ];

        const result = mergeSources(base, schema);

        expect(result).to.have.length(1);
        expect(result[0]).to.deep.equal({
            id: "source-1",
            href: "new-link",
            field: "summary",
            props: { textRange: [1, 15] }
        });
    });

    it("should normalize strings by transforming them into objects with an href property", () => {
        const base: ReviewSourceInput[] = ["https://google.com"];
        const schema: ReviewSourceInput[] = [
            { href: "https://google.com" }
        ];

        const result = mergeSources(base, schema);

        expect(result).to.have.length(1);
        expect(result[0]).to.deep.equal({
            href: "https://google.com"
        });
    });

    it("should return an empty array if empty or undefined arrays are provided", () => {
        expect(mergeSources()).to.deep.equal([]);
        expect(mergeSources([], [])).to.deep.equal([]);
    });

    it("should safely ignore null or undefined values within arrays without throwing errors", () => {
        const base = [null, { id: "1", href: "link1" }, undefined] as unknown as ReviewSourceInput[];
        const schema = [{ id: "1", field: "process" }, null] as unknown as ReviewSourceInput[];

        const result = mergeSources(base, schema);

        expect(result).to.have.length(1);
        expect(result[0]).to.deep.equal({
            id: "1",
            href: "link1",
            field: "process"
        });
    });

    it("should merge using the composite key (href + field + targetText) when there is no ID", () => {
        const base: ReviewSourceInput[] = [{
            href: "https://link.com",
            field: "question1",
            props: { targetText: "text" }
        }];
        const schema: ReviewSourceInput[] = [{
            href: "https://link.com",
            field: "question1",
            props: { targetText: "text", textRange: "5-10" }
        }];

        const result = mergeSources(base, schema);

        expect(result).to.have.length(1);
        expect(result[0].props).to.deep.equal({
            targetText: "text",
            textRange: "5-10"
        });
    });

    it("should NOT merge if the composite key is different (distinct fields)", () => {
        const base: ReviewSourceInput[] = [
            { href: "https://link.com", field: "question1" }
        ];
        const schema: ReviewSourceInput[] = [
            { href: "https://link.com", field: "question2" }
        ];

        const result = mergeSources(base, schema);

        expect(result).to.have.length(2);
        expect(result[0].field).to.equal("question1");
        expect(result[1].field).to.equal("question2");
    });

    it("should add new sources from the schema that did not previously exist in the base", () => {
        const base: ReviewSourceInput[] = [
            { id: "source-A", href: "link-A" }
        ];
        const schema: ReviewSourceInput[] = [
            { id: "source-B", href: "link-B" }
        ];

        const result = mergeSources(base, schema);

        expect(result).to.have.length(2);
        const ids = result.map(r => (r as ReviewSource).id);
        expect(ids).to.include("source-A");
        expect(ids).to.include("source-B");
    });

    it("should prioritize schema properties while keeping exclusive base properties", () => {
        const base: ReviewSourceInput[] = [
            { id: "123", href: "base-link", field: "summary" }
        ];
        const schema: ReviewSourceInput[] = [
            { id: "123", href: "schema-link" }
        ];

        const result = mergeSources(base, schema);

        expect(result).to.have.length(1);
        expect((result[0] as ReviewSource).href).to.equal("schema-link");
        expect((result[0] as ReviewSource).field).to.equal("summary");
    });
});
