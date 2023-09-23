import { Test, TestingModule } from "@nestjs/testing";
import { EditorParseModule } from "./editor-parse.module";
import { EditorParseService } from "./editor-parse.service";
const util = require("util");

describe("ParserService", () => {
    let editorParseService: EditorParseService;

    beforeEach(async () => {
        const testingModule: TestingModule = await Test.createTestingModule({
            imports: [EditorParseModule],
        }).compile();
        editorParseService =
            testingModule.get<EditorParseService>(EditorParseService);
    });

    describe("parse()", () => {
        it("Report is parsed correctly", async () => {
            const databaseReport = {
                sources: [
                    {
                        href: "https://loremipsum.io/generator/?n=5&t=p",
                        field: "summary",
                        textRange: [0, 11],
                    },
                    {
                        href: "https://google.com",
                        field: "summary",
                        textRange: [20, 24],
                    },
                ],
                questions: [
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmo…",
                    "teste",
                ],
                summary:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmo…",
                report: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmo…",
                verification:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmo…",
            };

            const expected = {
                type: "doc",
                content: [
                    {
                        type: "questions",
                        content: [
                            {
                                type: "paragraph",
                                content: [
                                    {
                                        type: "text",
                                        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmo…",
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: "questions",
                        content: [
                            {
                                type: "paragraph",
                                content: [
                                    {
                                        type: "text",
                                        text: "teste",
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: "summary",
                        content: [
                            {
                                type: "paragraph",
                                content: [
                                    {
                                        type: "text",
                                        text: "Lorem ipsum",
                                    },
                                ],
                                marks: [
                                    {
                                        type: "link",
                                        attrs: {
                                            href: "https://loremipsum.io/generator/?n=5&t=p",
                                            target: null,
                                            auto: false,
                                        },
                                    },
                                ],
                            },
                            {
                                type: "paragraph",
                                content: [
                                    {
                                        type: "text",
                                        text: " dolor si",
                                    },
                                ],
                            },
                            {
                                type: "paragraph",
                                content: [
                                    {
                                        type: "text",
                                        text: "t am",
                                    },
                                ],
                                marks: [
                                    {
                                        type: "link",
                                        attrs: {
                                            href: "https://google.com",
                                            target: null,
                                            auto: false,
                                        },
                                    },
                                ],
                            },
                            {
                                type: "paragraph",
                                content: [
                                    {
                                        type: "text",
                                        text: "et, consectetur adipiscing elit, sed do eiusmo…",
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: "report",
                        content: [
                            {
                                type: "paragraph",
                                content: [
                                    {
                                        type: "text",
                                        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmo…",
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: "verification",
                        content: [
                            {
                                type: "paragraph",
                                content: [
                                    {
                                        type: "text",
                                        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmo…",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            };

            const editorContent = await editorParseService.schema2editor(
                databaseReport
            );
            console.log(
                util.inspect(editorContent, {
                    showHidden: false,
                    depth: null,
                    colors: true,
                })
            );
            expect(editorContent).toMatchObject(expected);
        });
    });
});
