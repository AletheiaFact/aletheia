import { Test, TestingModule } from "@nestjs/testing";
import { EditorParseModule } from "./editor-parse.module";
import { EditorParseService } from "./editor-parse.service";
import { ReviewTaskMachineContextReviewData } from "../claim-review-task/dto/create-claim-review-task.dto";
import { RemirrorJSON } from "remirror";
const util = require("util");

describe("ParserService", () => {
    let editorParseService: EditorParseService;

    const schemaContent: ReviewTaskMachineContextReviewData = {
        sources: [
            {
                href: "https://google.com",
                field: "report",
                textRange: [7, 21],
            },
        ],
        questions: ["teste1"],
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

    beforeEach(async () => {
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

            console.log(
                util.inspect(editorResult, {
                    showHidden: false,
                    depth: null,
                    colors: true,
                })
            );
            expect(editorResult).toMatchObject(editorContent);
        });

        it("Editor content is parsed correctly", async () => {
            const schemaResult = await editorParseService.editor2schema(
                editorContent
            );

            console.log(
                util.inspect(schemaResult, {
                    showHidden: false,
                    depth: null,
                    colors: true,
                })
            );

            expect(schemaResult).toMatchObject(schemaContent);
        });
    });
});
