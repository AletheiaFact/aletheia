import { Test, TestingModule } from "@nestjs/testing";
import { EditorParseModule } from "./editor-parse.module";
import { EditorParseService } from "./editor-parse.service";
import { ReviewTaskMachineContextReviewData } from "../claim-review-task/dto/create-claim-review-task.dto";
import { RemirrorJSON } from "remirror";

describe("ParserService", () => {
    let editorParseService: EditorParseService;
    const schemaHtml = {
        questions: ["teste1", "testekakaka ava"],
        summary: "<div><p>teste4</p></div>",
        report: `<div><p>teste2 <a href='#esse e um link' rel='noopener noreferrer nofollow'>esse e um link<sup>1</sup></a></p></div>`,
        verification: "<div><p>teste3</p></div>",
    };

    const schemaContent: ReviewTaskMachineContextReviewData = {
        sources: [
            {
                href: "https://google.com",
                field: "report",
                textRange: [7, 21],
                targetText: "esse e um link",
                sup: 1,
            },
        ],
        questions: ["teste1", "testekakaka ava"],
        summary: "teste4",
        report: "teste2 esse e um link",
        verification: "teste3",
    };

    const editorContent: RemirrorJSON = {
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
                                text: "teste1",
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
                                text: "testekakaka ava",
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
                                text: "teste4",
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
                                text: "teste2 ",
                            },
                            {
                                type: "text",
                                text: "esse e um link",
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
                                text: "teste3",
                            },
                        ],
                    },
                ],
            },
        ],
    };

    beforeAll(async () => {
        const testingModule: TestingModule = await Test.createTestingModule({
            imports: [EditorParseModule],
        }).compile();
        editorParseService =
            testingModule.get<EditorParseService>(EditorParseService);
    });

    describe("parse()", () => {
        it("Report is parsed correctly", async () => {
            const editorResult = await editorParseService.schema2editor(
                schemaContent
            );

            expect(editorResult).toMatchObject(editorContent);
        });

        it("Editor content is parsed correctly", async () => {
            const schemaResult = await editorParseService.editor2schema(
                editorContent
            );

            expect(schemaResult).toMatchObject(schemaContent);
        });

        it("Schema to HTML is parsed correctly", async () => {
            const schemaHtmlResult = await editorParseService.schema2html(
                schemaContent
            );
            expect(schemaHtmlResult).toMatchObject(schemaHtml);
        });
    });
});
