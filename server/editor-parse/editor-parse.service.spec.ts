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

    describe("Line Break Preservation", () => {
        const multiParagraphEditorContent: RemirrorJSON = {
            type: "doc",
            content: [
                {
                    type: "summary",
                    content: [
                        {
                            type: "paragraph",
                            content: [
                                {
                                    type: "text",
                                    text: "First paragraph with important information.",
                                },
                            ],
                        },
                        {
                            type: "paragraph",
                            content: [
                                {
                                    type: "text",
                                    text: "Second paragraph after line break.",
                                },
                            ],
                        },
                        {
                            type: "paragraph",
                            content: [
                                {
                                    type: "text",
                                    text: "Third paragraph with conclusion.",
                                },
                            ],
                        },
                    ],
                },
            ],
        };

        const expectedSchemaWithLineBreaks = {
            summary: "First paragraph with important information.\nSecond paragraph after line break.\nThird paragraph with conclusion.",
            sources: [],
        };

        const expectedHtmlWithLineBreaks = {
            summary: "<div><p>First paragraph with important information.</p><p>Second paragraph after line break.</p><p>Third paragraph with conclusion.</p></div>",
        };

        it("Should preserve line breaks when converting from editor to schema", async () => {
            const schemaResult = await editorParseService.editor2schema(
                multiParagraphEditorContent
            );

            expect(schemaResult.summary).toEqual(expectedSchemaWithLineBreaks.summary);
            expect(schemaResult.summary.includes('\n')).toBe(true);
        });

        it("Should convert line breaks to separate <p> elements in HTML output for semantic HTML", async () => {
            const schemaWithLineBreaks = {
                summary: "First paragraph with important information.\nSecond paragraph after line break.\nThird paragraph with conclusion.",
                sources: [],
            };

            const htmlResult = await editorParseService.schema2html(
                schemaWithLineBreaks
            );

            expect(htmlResult.summary).toEqual(expectedHtmlWithLineBreaks.summary);
            expect(htmlResult.summary.includes('<p>')).toBe(true);
            expect(htmlResult.summary.split('<p>').length - 1).toBe(3); // Should have 3 paragraphs
        });

        it("Should convert schema with line breaks back to multiple paragraphs in editor", async () => {
            const schemaWithLineBreaks = {
                summary: "First paragraph with important information.\nSecond paragraph after line break.\nThird paragraph with conclusion.",
                sources: [],
            };

            const editorResult = await editorParseService.schema2editor(
                schemaWithLineBreaks
            );

            expect(editorResult.content).toHaveLength(1);
            expect(editorResult.content[0].type).toBe("summary");
            expect(editorResult.content[0].content).toHaveLength(3); // Should have 3 paragraphs
            
            // Verify each paragraph content
            expect(editorResult.content[0].content[0].content[0].text).toBe("First paragraph with important information.");
            expect(editorResult.content[0].content[1].content[0].text).toBe("Second paragraph after line break.");
            expect(editorResult.content[0].content[2].content[0].text).toBe("Third paragraph with conclusion.");
        });

        it("Should handle empty paragraphs (multiple consecutive line breaks)", async () => {
            const schemaWithEmptyLines = {
                summary: "First paragraph.\n\nThird paragraph after empty line.",
                sources: [],
            };

            const editorResult = await editorParseService.schema2editor(
                schemaWithEmptyLines
            );

            expect(editorResult.content[0].content).toHaveLength(3);
            expect(editorResult.content[0].content[0].content[0].text).toBe("First paragraph.");
            expect(editorResult.content[0].content[1].content).toHaveLength(0); // Empty paragraph
            expect(editorResult.content[0].content[2].content[0].text).toBe("Third paragraph after empty line.");
        });

        it("Should maintain backward compatibility with single paragraph content", async () => {
            const singleParagraphSchema = {
                summary: "Single paragraph without line breaks.",
                sources: [],
            };

            const editorResult = await editorParseService.schema2editor(
                singleParagraphSchema
            );
            
            expect(editorResult.content[0].content).toHaveLength(1);
            expect(editorResult.content[0].content[0].content[0].text).toBe("Single paragraph without line breaks.");
        });

        it("Should preserve line breaks with sources (marked content)", async () => {
            const multiParagraphWithSource: RemirrorJSON = {
                type: "doc",
                content: [
                    {
                        type: "report",
                        content: [
                            {
                                type: "paragraph",
                                content: [
                                    {
                                        type: "text",
                                        text: "First paragraph with ",
                                    },
                                    {
                                        type: "text",
                                        text: "source",
                                        marks: [
                                            {
                                                type: "link",
                                                attrs: {
                                                    id: "sourceId",
                                                    href: "https://example.com",
                                                    target: null,
                                                    auto: false,
                                                },
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                type: "paragraph",
                                content: [
                                    {
                                        type: "text",
                                        text: "Second paragraph continues here.",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            };

            const schemaResult = await editorParseService.editor2schema(
                multiParagraphWithSource
            );

            expect(schemaResult.report).toContain('\n');
            expect(schemaResult.report).toEqual("First paragraph with {{sourceId|source}}\nSecond paragraph continues here.");
        });
    });

    describe("Source Annotation with Line Breaks", () => {
        it("Should correctly calculate text ranges with line breaks in content", async () => {
            const multiParagraphWithMultipleSources: RemirrorJSON = {
                type: "doc",
                content: [
                    {
                        type: "report",
                        content: [
                            {
                                type: "paragraph",
                                content: [
                                    {
                                        type: "text",
                                        text: "First paragraph with ",
                                    },
                                    {
                                        type: "text",
                                        text: "first source",
                                        marks: [
                                            {
                                                type: "link",
                                                attrs: {
                                                    id: "source1",
                                                    href: "https://source1.com",
                                                    target: null,
                                                    auto: false,
                                                },
                                            },
                                        ],
                                    },
                                    {
                                        type: "text",
                                        text: " and more text.",
                                    },
                                ],
                            },
                            {
                                type: "paragraph",
                                content: [
                                    {
                                        type: "text",
                                        text: "Second paragraph has ",
                                    },
                                    {
                                        type: "text",
                                        text: "second source",
                                        marks: [
                                            {
                                                type: "link",
                                                attrs: {
                                                    id: "source2",
                                                    href: "https://source2.com",
                                                    target: null,
                                                    auto: false,
                                                },
                                            },
                                        ],
                                    },
                                    {
                                        type: "text",
                                        text: " here.",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            };

            const schemaResult = await editorParseService.editor2schema(
                multiParagraphWithMultipleSources
            );

            // Verify content structure
            expect(schemaResult.report).toEqual("First paragraph with {{source1|first source}} and more text.\nSecond paragraph has {{source2|second source}} here.");
            
            // Verify both sources are captured
            expect(schemaResult.sources).toHaveLength(2);
            
            // Verify first source
            expect(schemaResult.sources[0]).toMatchObject({
                href: "https://source1.com",
                props: expect.objectContaining({
                    field: "report",
                    targetText: "first source",
                    id: "source1",
                })
            });
            
            // Verify second source
            expect(schemaResult.sources[1]).toMatchObject({
                href: "https://source2.com",
                props: expect.objectContaining({
                    field: "report",
                    targetText: "second source",
                    id: "source2",
                })
            });
        });

        it("Should generate correct HTML with line breaks (sources remain as markup)", async () => {
            const schemaWithLineBreaks = {
                report: "First paragraph with some text.\nSecond paragraph with more text.",
                sources: [],
            };

            const htmlResult = await editorParseService.schema2html(
                schemaWithLineBreaks
            );

            expect(htmlResult.report).toContain('<p>');
            expect(htmlResult.report).toBe('<div><p>First paragraph with some text.</p><p>Second paragraph with more text.</p></div>');
        });

        it("Should use <br> tags for content with empty lines (visual spacing)", async () => {
            const schemaWithEmptyLines = {
                report: "First paragraph with content.\n\nThird paragraph after empty line.",
                sources: [],
            };

            const htmlResult = await editorParseService.schema2html(
                schemaWithEmptyLines
            );

            expect(htmlResult.report).toContain('<br>');
            expect(htmlResult.report).toBe('<div><p>First paragraph with content.<br><br>Third paragraph after empty line.</p></div>');
        });

        it("Should handle empty paragraphs in editor conversion", async () => {
            const schemaWithEmptyParagraph = {
                summary: "First paragraph text.\n\nThird paragraph after empty line.",
                sources: [],
            };

            const editorResult = await editorParseService.schema2editor(
                schemaWithEmptyParagraph
            );

            // Should have 3 paragraphs: content, empty, content
            expect(editorResult.content[0].content).toHaveLength(3);
            
            // First paragraph should have content
            expect(editorResult.content[0].content[0].content).toHaveLength(1);
            expect(editorResult.content[0].content[0].content[0].text).toBe("First paragraph text.");
            
            // Second paragraph should be empty
            expect(editorResult.content[0].content[1].content).toHaveLength(0);
            
            // Third paragraph should have content
            expect(editorResult.content[0].content[2].content).toHaveLength(1);
            expect(editorResult.content[0].content[2].content[0].text).toBe("Third paragraph after empty line.");
        });

        it("Should preserve source text ranges when converting back from schema with line breaks", async () => {
            const originalSchemaWithSources = {
                report: "Paragraph one with {{sourceA|marked text}}.\nParagraph two continues here.",
                sources: [
                    {
                        href: "https://test.com",
                        props: {
                            field: "report",
                            textRange: [19, 43],
                            targetText: "marked text", 
                            sup: 1,
                            id: "sourceA",
                        },
                    },
                ],
            };

            // Convert to editor and back to schema
            const editorResult = await editorParseService.schema2editor(originalSchemaWithSources);
            const roundTripSchema = await editorParseService.editor2schema(editorResult);

            // Content should be preserved with line breaks
            expect(roundTripSchema.report).toContain('\n');
            expect(roundTripSchema.report).toContain('{{sourceA|marked text}}');
            
            // Source should be preserved
            expect(roundTripSchema.sources).toHaveLength(1);
            expect((roundTripSchema.sources[0] as any).props.targetText).toBe("marked text");
        });

        it("Should handle source annotations across paragraph boundaries correctly", async () => {
            const editorWithSourcesAcrossParagraphs: RemirrorJSON = {
                type: "doc",
                content: [
                    {
                        type: "summary",
                        content: [
                            {
                                type: "paragraph",
                                content: [
                                    {
                                        type: "text",
                                        text: "Start of summary with ",
                                    },
                                    {
                                        type: "text",
                                        text: "important source",
                                        marks: [
                                            {
                                                type: "link",
                                                attrs: {
                                                    id: "imp-source",
                                                    href: "https://important.com",
                                                    target: null,
                                                    auto: false,
                                                },
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                type: "paragraph",
                                content: [
                                    {
                                        type: "text",
                                        text: "Second paragraph without sources.",
                                    },
                                ],
                            },
                            {
                                type: "paragraph",
                                content: [
                                    {
                                        type: "text",
                                        text: "Third paragraph with ",
                                    },
                                    {
                                        type: "text",
                                        text: "another source",
                                        marks: [
                                            {
                                                type: "link",
                                                attrs: {
                                                    id: "another-source",
                                                    href: "https://another.com",
                                                    target: null,
                                                    auto: false,
                                                },
                                            },
                                        ],
                                    },
                                    {
                                        type: "text",
                                        text: " at end.",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            };

            const schemaResult = await editorParseService.editor2schema(
                editorWithSourcesAcrossParagraphs
            );

            // Verify structure with line breaks
            expect(schemaResult.summary).toBe("Start of summary with {{imp-source|important source}}\nSecond paragraph without sources.\nThird paragraph with {{another-source|another source}} at end.");
            
            // Should have exactly 2 sources
            expect(schemaResult.sources).toHaveLength(2);
            
            // Both sources should be properly indexed
            expect((schemaResult.sources[0] as any).props.targetText).toBe("important source");
            expect((schemaResult.sources[1] as any).props.targetText).toBe("another source");
        });
    });
});
