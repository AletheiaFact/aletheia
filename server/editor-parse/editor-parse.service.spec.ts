import { Test, TestingModule } from "@nestjs/testing";
import { EditorParseModule } from "./editor-parse.module";
import { EditorParseService } from "./editor-parse.service";
import { ReviewTaskMachineContextReviewData } from "../review-task/dto/create-review-task.dto";
import { RemirrorJSON } from "remirror";

/**
 * EditorParseService Unit Test Suite
 * 
 * Tests the bidirectional transformation service that converts between different
 * representation formats for the collaborative fact-checking editor system.
 * 
 * Business Context:
 * The editor parse service handles content transformation between three key formats:
 * 1. Schema format - Internal data structure with source references
 * 2. Editor format - Remirror JSON for rich text editing
 * 3. HTML format - Final rendered output for display
 * 
 * Core Functionality:
 * - Schema ↔ Editor: Bidirectional conversion for editing workflows
 * - Schema → HTML: Rendering for final display with source citations
 * - Source link processing: Converting markup references to interactive citations
 * - Content validation: Ensuring data integrity across transformations
 * 
 * Data Flow:
 * 1. User creates content in editor (Remirror JSON)
 * 2. Editor → Schema conversion for storage and processing
 * 3. Schema → HTML conversion for public display with citations
 * 4. Bidirectional validation ensures content consistency
 */
describe("EditorParseService", () => {
    let editorParseService: EditorParseService;
    const schemaHtml = {
        questions: ["teste1", "testekakaka ava"],
        summary: "<div><p>teste4</p></div>",
        report: `<div><p>duplicated word <a href='#duplicated' rel='noopener noreferrer nofollow'>duplicated<sup>1</sup></a></p></div>`,
        verification: "<div><p>teste3</p></div>",
    };

    const schemaContent: ReviewTaskMachineContextReviewData = {
        sources: [
            {
                href: "https://google.com",
                props: {
                    field: "report",
                    textRange: [16, 39],
                    targetText: "duplicated",
                    sup: 1,
                    id: "uniqueId",
                },
            },
        ],
        questions: ["teste1", "testekakaka ava"],
        summary: "teste4",
        report: "duplicated word {{uniqueId|duplicated}}",
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
                                text: "duplicated word ",
                            },
                            {
                                type: "text",
                                text: "duplicated",
                                marks: [
                                    {
                                        type: "link",
                                        attrs: {
                                            id: "uniqueId",
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
        /**
         * Test: Schema to Editor Conversion - Rich Text Structure Generation
         * 
         * Purpose: Validates conversion from internal schema format to Remirror editor format
         * Business Logic:
         * - Transforms schema content structure to Remirror JSON nodes
         * - Converts source references to link marks with metadata
         * - Organizes content by section types (questions, summary, report, verification)
         * - Maintains source attribution and link relationships
         * 
         * Test Data:
         * - Schema with questions, summary, report (with source), verification
         * - Source reference: {{uniqueId|duplicated}} → link mark with href
         * - Expected Remirror JSON with proper node structure
         * 
         * Validates:
         * - Correct Remirror document structure (doc → sections → paragraphs → text)
         * - Source markup conversion to link marks
         * - Content section organization and typing
         * - Metadata preservation (id, href, target attributes)
         */
        it("Schema to Editor conversion is parsed correctly", async () => {
            const editorResult = await editorParseService.schema2editor(
                schemaContent
            );

            expect(editorResult).toMatchObject(editorContent);
        });

        /**
         * Test: Editor to Schema Conversion - Content Structure Extraction
         * 
         * Purpose: Validates conversion from Remirror editor format to internal schema
         * Business Logic:
         * - Extracts content from Remirror JSON nodes by section type
         * - Converts link marks back to source reference markup
         * - Organizes content into schema structure with source metadata
         * - Preserves source relationships and attribution data
         * 
         * Test Data:
         * - Remirror JSON with structured content sections
         * - Link marks with id, href, and target attributes
         * - Expected schema format with {{id|text}} source references
         * 
         * Validates:
         * - Correct schema content extraction from editor nodes
         * - Link mark conversion to source markup format
         * - Section content organization (questions array, text fields)
         * - Source metadata preservation and formatting
         */
        it("Editor to Schema conversion is parsed correctly", async () => {
            const schemaResult = await editorParseService.editor2schema(
                editorContent
            );

            expect(schemaResult).toMatchObject(schemaContent);
        });

        /**
         * Test: Schema to HTML Conversion - Rendering with Citations
         * 
         * Purpose: Validates conversion from schema format to final HTML display format
         * Business Logic:
         * - Renders schema content as HTML with proper markup
         * - Converts source references to interactive citation links
         * - Generates superscript numbering for source citations
         * - Creates accessible link structure with proper attributes
         * 
         * Test Data:
         * - Schema content with embedded source references
         * - Source metadata with href, textRange, targetText, and sup numbering
         * - Expected HTML with <div>, <p>, <a>, and <sup> elements
         * 
         * Validates:
         * - Correct HTML structure generation (div containers, paragraphs)
         * - Source reference conversion to citation links
         * - Superscript numbering and link attributes
         * - Accessibility features (rel attributes, proper markup)
         */
        it("Schema to HTML conversion is parsed correctly", async () => {
            const schemaHtmlResult = await editorParseService.schema2html(
                schemaContent
            );
            expect(schemaHtmlResult).toMatchObject(schemaHtml);
        });

        /**
         * Test: Source Position Accuracy - Citation Placement Validation
         * 
         * Purpose: Validates accurate positioning of source citations in HTML output
         * Business Logic:
         * - Ensures source citations appear at correct text positions
         * - Maintains source reference integrity during HTML conversion
         * - Preserves citation context and readability
         * - Validates superscript numbering and link formatting
         * 
         * Test Data:
         * - Report text: "duplicated word {{uniqueId|duplicated}}"
         * - Expected HTML: "duplicated word <a href='#duplicated' rel='noopener noreferrer nofollow'>duplicated<sup>1</sup></a>"
         * - Source citation with proper attributes and superscript
         * 
         * Validates:
         * - Exact text position of source citations
         * - Correct HTML link generation with href and rel attributes
         * - Proper superscript numbering display
         * - Citation text accuracy and formatting
         */
        it("Source citation position accuracy in HTML output", async () => {
            const schemaHtmlResult = await editorParseService.schema2html(
                schemaContent
            );
            expect(schemaHtmlResult.report).toEqual(schemaHtml.report);
        });

        /**
         * Test: Bidirectional Source Processing - Editor Link Mark Accuracy
         * 
         * Purpose: Validates accurate source processing in editor-to-schema conversion
         * Business Logic:
         * - Converts Remirror link marks back to schema markup format
         * - Maintains source reference position and metadata accuracy
         * - Ensures bidirectional conversion consistency
         * - Preserves source attribution and text relationships
         * 
         * Test Data:
         * - Remirror editor content with link marks containing source metadata
         * - Link marks with id, href, target attributes on specific text ranges
         * - Expected schema markup: "duplicated word {{uniqueId|duplicated}}"
         * 
         * Validates:
         * - Accurate conversion from link marks to schema markup
         * - Source position preservation in text content
         * - Metadata extraction and formatting accuracy
         * - Bidirectional transformation consistency
         */
        it("Editor link mark to schema markup conversion accuracy", async () => {
            const schemaResult = await editorParseService.editor2schema(
                editorContent
            );

            expect(schemaResult.report).toEqual(schemaContent.report);
        });
    });
});
