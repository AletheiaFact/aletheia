import { Test, TestingModule } from "@nestjs/testing";
import { ParserService } from "./parser.service";
import * as fs from "fs";
import { TestConfigOptions } from "../../tests/utils/TestConfigOptions";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Types } from "mongoose";
import { AppModule } from "../../app.module";

/**
 * ParserService Unit Test Suite
 * 
 * Tests the claim text parsing service that converts unstructured text into
 * structured speech components (paragraphs and sentences) for fact-checking analysis.
 * 
 * Business Context:
 * The parser service is responsible for breaking down claim text into analyzable
 * components. It handles various text structures including multi-paragraph content,
 * music lyrics with complex punctuation, and academic text with abbreviations.
 * 
 * Core Functionality:
 * - Text segmentation into paragraphs and sentences
 * - Sentence boundary detection with abbreviation handling
 * - Speech object creation with nested content structure
 * - Database integration for persistent storage
 * 
 * Data Flow:
 * 1. Raw claim text → paragraph splitting → sentence tokenization
 * 2. Speech object creation → paragraph/sentence entities → database persistence
 * 3. Population of nested relationships for complete object graph
 */
describe("ParserService", () => {
    let parserService: ParserService;
    let db: any;
    let moduleFixture: TestingModule;
    const claimRevisionIdMock = new Types.ObjectId();

    beforeAll(async () => {
        db = await MongoMemoryServer.create({ instance: { port: 35025 } });
        const mongoUri = db.getUri();
        
        // Update the test config with the actual MongoDB URI
        const testConfig = {
            ...TestConfigOptions.config,
            db: {
                ...TestConfigOptions.config.db,
                connection_uri: mongoUri,
            },
        };

        moduleFixture = await Test.createTestingModule({
            imports: [AppModule.register(testConfig)],
        }).compile();

        parserService = moduleFixture.get<ParserService>(ParserService);
    });

    beforeEach(async () => {
        // Clear any test data if needed
    });

    describe("parse()", () => {
        /**
         * Test: Basic Claim Parsing - Multi-paragraph Text Structure
         * 
         * Purpose: Validates parsing of standard multi-paragraph claim text
         * Business Logic:
         * - Splits text on double newlines to identify paragraphs
         * - Tokenizes each paragraph into individual sentences
         * - Creates hierarchical speech → paragraphs → sentences structure
         * - Persists entities to database with proper relationships
         * 
         * Test Data:
         * - 2 paragraphs separated by \n\n
         * - First paragraph: 3 sentences (with Latin text)
         * - Second paragraph: 4 sentences (with Latin text)
         * 
         * Validates:
         * - Correct paragraph count (2)
         * - Correct sentence count per paragraph (3, 4)
         * - Proper database persistence and population
         * - Speech object type classification
         */
        it("Claim is parsed correctly", async () => {
            const claimText =
                "Pellentesque auctor neque nec urna. Nulla facilisi. Praesent nec nisl a purus blandit viverra." +
                "\n\nNam at tortor in tellus interdum sagittis. Ut leo. Praesent adipiscing. Curabitur nisi.";
            const parseOutput = await (
                await parserService.parse(claimText, claimRevisionIdMock)
            )
                .populate({
                    path: "content",
                    populate: {
                        path: "content",
                    },
                })
                .execPopulate();

            const paragraphs = parseOutput.content;
            expect(Array.isArray(paragraphs)).toBe(true);
            expect(paragraphs.length).toEqual(2);
            expect(paragraphs[0].content.length).toEqual(3);
            expect(paragraphs[1].content.length).toEqual(4);
        });

        /**
         * Test: Complex Music Text Parsing - Lyrics with Dense Punctuation
         * 
         * Purpose: Validates parsing of complex text with irregular punctuation patterns
         * Business Logic:
         * - Handles text with dense punctuation (music lyrics, poetry)
         * - Manages complex sentence boundaries in artistic content
         * - Maintains parser robustness with non-standard text structures
         * - Processes long continuous text blocks
         * 
         * Test Data:
         * - Music lyrics from external file (claim_music.txt)
         * - Complex punctuation patterns and line breaks
         * - Single paragraph with 46 sentences
         * 
         * Validates:
         * - Parser doesn't fail on complex punctuation
         * - Correct paragraph segmentation (1 paragraph)
         * - Accurate sentence tokenization (46 sentences)
         * - Robust handling of artistic text formats
         */
        it("Music structure should not fail", async () => {
            const claimText = fs.readFileSync(
                `${__dirname}/test-fixtures/claim_music.txt`,
                "utf-8"
            );
            const parseOutput = (
                await (
                    await parserService.parse(claimText, claimRevisionIdMock)
                )
                    .populate({
                        path: "content",
                        populate: {
                            path: "content",
                        },
                    })
                    .execPopulate()
            ).toObject();
            const paragraphs = parseOutput.content;
            expect(paragraphs.length).toEqual(1);
            expect(paragraphs[0].content.length).toEqual(46);
        });

        /**
         * Test: Schema Compliance - Speech Object Structure Validation
         * 
         * Purpose: Validates that parsed output conforms to expected data schema
         * Business Logic:
         * - Ensures consistent object structure across all parsing operations
         * - Validates required properties and data types
         * - Confirms proper speech object classification
         * - Maintains API contract for downstream consumers
         * 
         * Test Data:
         * - Simple text with paragraph break ("Nulla facilisi.\n\nUt leo.")
         * - Minimal content to focus on structure validation
         * 
         * Validates:
         * - Required properties present (content, type)
         * - Correct type classification ("speech")
         * - Schema consistency and data integrity
         * - Proper object graph structure
         */
        it("parsed object conforms to schema", async () => {
            const claimText = "Nulla facilisi.\n\nUt leo.";
            const parseOutput = (
                await (
                    await parserService.parse(claimText, claimRevisionIdMock)
                )
                    .populate({
                        path: "content",
                        populate: {
                            path: "content",
                        },
                    })
                    .execPopulate()
            ).toObject();
            expect(Object.keys(parseOutput)).toEqual(
                expect.arrayContaining(["content", "type"])
            );
            expect(parseOutput.type).toEqual("speech");
        });

        /**
         * Test: Abbreviation Handling - Ph.D. Degree Title Recognition
         * 
         * Purpose: Validates proper handling of academic abbreviations with periods
         * Business Logic:
         * - Recognizes "Ph.D." as abbreviation, not sentence terminator
         * - Prevents incorrect sentence segmentation on academic titles
         * - Maintains text cohesion for educational and professional content
         * - Handles multiple abbreviation instances in single sentence
         * 
         * Test Data:
         * - Text with multiple "Ph.D." instances
         * - "Jose is Ph.D. and Maria is a Ph.D."
         * - Expected: single sentence, not multiple sentences
         * 
         * Validates:
         * - Single paragraph creation (1)
         * - Single sentence preservation (1)
         * - Abbreviation boundary detection accuracy
         * - Academic text parsing robustness
         */
        it("Ph.D word is not confused with end of sentence", async () => {
            const claimText = "Jose is Ph.D. and Maria is a Ph.D.";
            const parseOutput = await (
                await parserService.parse(claimText, claimRevisionIdMock)
            )
                .populate({
                    path: "content",
                    populate: {
                        path: "content",
                    },
                })
                .execPopulate();
            const paragraphs = parseOutput.content;
            expect(paragraphs.length).toEqual(1);
            expect(paragraphs[0].content.length).toEqual(1);
        });

        /**
         * Test: Title Prefix Handling - Common Honorifics and Abbreviations
         * 
         * Purpose: Validates recognition of common title prefixes and abbreviations
         * Business Logic:
         * - Recognizes Mr., Mrs., Ms., Dr., St. as abbreviations
         * - Prevents sentence fragmentation on common titles
         * - Maintains natural text flow in formal content
         * - Handles multiple prefixes in complex sentences
         * 
         * Test Data:
         * - Text with multiple title prefixes
         * - "Mr. Jose and Mrs. Maria lives in St. Monica with Ms. Butterfly their Dr. of the year"
         * - Expected: single coherent sentence
         * 
         * Validates:
         * - Single paragraph creation (1)
         * - Single sentence preservation (1)
         * - Multiple abbreviation recognition
         * - Formal text parsing accuracy
         */
        it("Prefixes are not confused with end of sentence", async () => {
            const claimText =
                "Mr. Jose and Mrs. Maria lives in St. Monica with Ms. Butterfly their Dr. of the year";
            const parseOutput = await (
                await parserService.parse(claimText, claimRevisionIdMock)
            )
                .populate({
                    path: "content",
                    populate: {
                        path: "content",
                    },
                })
                .execPopulate();
            const paragraphs = parseOutput.content;
            expect(paragraphs.length).toEqual(1);
            expect(paragraphs[0].content.length).toEqual(1);
        });
    });

    afterAll(async () => {
        if (db) {
            await db.stop();
        }
    });
});
