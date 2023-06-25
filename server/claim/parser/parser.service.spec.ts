import { Test, TestingModule } from "@nestjs/testing";
import { ParserService } from "./parser.service";
import * as fs from "fs";
import { SpeechModule } from "../types/speech/speech.module";
import { ParagraphModule } from "../types/paragraph/paragraph.module";
import { SentenceModule } from "../types/sentence/sentence.module";
import { MongooseModule } from "@nestjs/mongoose";
import { TestConfigOptions } from "../../tests/utils/TestConfigOptions";
import { MongoMemoryServer } from "mongodb-memory-server";

describe("ParserService", () => {
    let parserService: ParserService;
    let db: any;

    beforeAll(async () => {
        db = await MongoMemoryServer.create({ instance: { port: 35025 } });
    });

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                MongooseModule.forRoot(
                    TestConfigOptions.config.db.connection_uri,
                    TestConfigOptions.config.db.options
                ),
                SpeechModule,
                ParagraphModule,
                SentenceModule,
            ],
            providers: [ParserService],
        }).compile();
        parserService = module.get<ParserService>(ParserService);
    });

    describe("parse()", () => {
        it("Claim is parsed correctly", async () => {
            const claimText =
                "Pellentesque auctor neque nec urna. Nulla facilisi. Praesent nec nisl a purus blandit viverra." +
                "\n\nNam at tortor in tellus interdum sagittis. Ut leo. Praesent adipiscing. Curabitur nisi.";
            const parseOutput = await (
                await parserService.parse(claimText)
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

        it("Music structure should not fail", async () => {
            const claimText = fs.readFileSync(
                `${__dirname}/test-fixtures/claim_music.txt`,
                "utf-8"
            );
            const parseOutput = (
                await (
                    await parserService.parse(claimText)
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

        it("parsed object conforms to schema", async () => {
            const claimText = "Nulla facilisi.\n\nUt leo.";
            const parseOutput = (
                await (
                    await parserService.parse(claimText)
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

        it("Ph.D word is not confused with end of sentence", async () => {
            const claimText = "Jose is Ph.D. and Maria is a Ph.D.";
            const parseOutput = await (
                await parserService.parse(claimText)
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

        it("Prefixes are not confused with end of sentence", async () => {
            const claimText =
                "Mr. Jose and Mrs. Maria lives in St. Monica with Ms. Butterfly their Dr. of the year";
            const parseOutput = await (
                await parserService.parse(claimText)
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

    afterAll(() => {
        db.stop();
    });
});
