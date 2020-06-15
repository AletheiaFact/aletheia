import Parser from "../../server/lib/parser";
import assert from "assert";
import fs from "fs";

const parser = new Parser();

describe("parse()", () => {
    it("Claim is parsed correctly", async () => {
        const claimText =
            "<p>Pellentesque auctor neque nec urna. Nulla facilisi. Praesent nec nisl a purus blandit viverra.</p>" +
            "\n<p>Nam at tortor in tellus interdum sagittis. Ut leo. Praesent adipiscing. Curabitur nisi.</p>";
        const parseOutput = parser.parse(claimText);
        const paragraphs = parseOutput.object;
        assert.ok(Array.isArray(paragraphs));
        assert.deepEqual(paragraphs.length, 2);
        assert.deepEqual(paragraphs[0].content.length, 3);
        assert.deepEqual(paragraphs[1].content.length, 4);
    });

    it("<br> paragraphs are stripped away", async () => {
        const claimText = "<p>Nulla facilisi.</p>\n<p><br></p>\n<p>Ut leo.</p>";
        const parseOutput = parser.parse(claimText);
        const paragraphs = parseOutput.object;
        assert.ok(Array.isArray(paragraphs));
        assert.deepEqual(paragraphs.length, 2);
    });

    it("Music structure should not fail", async () => {
        const claimText = fs.readFileSync(
            `${__dirname}/claim_music.html`,
            "utf-8"
        );
        const parseOutput = parser.parse(claimText);
        const paragraphs = parseOutput.object;
        assert.ok(Array.isArray(paragraphs));
        assert.deepEqual(paragraphs.length, 46);
    });

    it("parsed object conforms to schema", async () => {
        const claimText = "<p>Nulla facilisi.</p>\n<p><br></p>\n<p>Ut leo.</p>";
        const parseOutput = parser.parse(claimText);
        assert.deepEqual(Object.keys(parseOutput), ["object", "text", "html"]);
    });

    it("Ph.D word is not confused with end of sentence", async () => {
        const claimText = "<p>Jose is Ph.D. and Maria is a Ph.D.</p>";
        const parseOutput = parser.parse(claimText);
        const paragraphs = parseOutput.object;
        assert.ok(Array.isArray(paragraphs));
        assert.deepEqual(paragraphs.length, 1);
        assert.deepEqual(paragraphs[0].content.length, 1);
    });

    it("Prefixes are not confused with end of sentence", async () => {
        const claimText =
            "<p>Mr. Jose and Mrs. Maria lives in St. Monica with Ms. Butterfly their Dr. of the year</p>";
        const parseOutput = parser.parse(claimText);
        const paragraphs = parseOutput.object;
        assert.ok(Array.isArray(paragraphs));
        assert.deepEqual(paragraphs.length, 1);
        assert.deepEqual(paragraphs[0].content.length, 1);
    });
});

describe("extractSentence()", () => {
    it("One line claim should return 1 sentence", async () => {
        const text = "This is a claim";
        const sentences = await parser.extractSentences(text);
        assert.ok(Array.isArray(sentences));
        assert.deepEqual(sentences.length, 1);
    });
});
