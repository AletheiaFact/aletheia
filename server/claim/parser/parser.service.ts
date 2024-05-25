import { Injectable } from "@nestjs/common";
import { SentenceService } from "../types/sentence/sentence.service";
import { ParagraphService } from "../types/paragraph/paragraph.service";
import { SpeechService } from "../types/speech/speech.service";
import { SpeechDocument } from "../types/speech/schemas/speech.schema";
import { Types } from "mongoose";
import { GenerativeInformationService } from "../types/generative-information/generative-information.service";
import { GenerativeInformationDocument } from "../types/generative-information/schemas/generative-information.schema";
import { ContentModelEnum } from "../../types/enums";
const md5 = require("md5");
const nlp = require("compromise");
nlp.extend(require("compromise-sentences"));
nlp.extend(require("compromise-paragraphs"));

@Injectable()
export class ParserService {
    constructor(
        private speechService: SpeechService,
        private paragraphService: ParagraphService,
        private sentenceService: SentenceService,
        private generativeInformationService: GenerativeInformationService
    ) {}
    paragraphSequence: number;
    sentenceSequence: number;
    nlpOptions: object = { trim: true };

    async parse(
        content: string,
        personality = null,
        contentModel = ContentModelEnum.Speech
    ): Promise<SpeechDocument | GenerativeInformationDocument> {
        this.paragraphSequence = 0;
        this.sentenceSequence = 0;
        const result = [];
        const nlpContent = nlp(content);
        const paragraphs = nlpContent.paragraphs();
        const text = nlpContent.text(this.nlpOptions);

        paragraphs.forEach((paragraph) => {
            const paragraphId = this.createParagraphId();
            const sentences = this.postProcessSentences(paragraph.sentences());

            const paragraphDataHash = md5(
                `${this.paragraphSequence}${text}${paragraph}`
            );

            if (sentences && sentences.length) {
                return result.push(
                    this.paragraphService.create({
                        data_hash: paragraphDataHash,
                        props: {
                            id: paragraphId,
                        },
                        content: sentences.map((sentence) =>
                            this.parseSentence(sentence, paragraphDataHash)
                        ),
                    })
                );
            }
        });

        if (personality) {
            personality = Types.ObjectId(personality);
        }

        return await Promise.all(result).then(
            (
                object
            ): Promise<SpeechDocument | GenerativeInformationDocument> => {
                if (contentModel === ContentModelEnum.GenerativeInformation) {
                    return this.generativeInformationService.create({
                        content: object,
                    });
                }

                return this.speechService.create({
                    content: object,
                    personality,
                });
            }
        );
    }

    postProcessSentences(sentences) {
        let newSentences = [];
        sentences.forEach((sentence) => {
            const sentenceText = sentence.text(this.nlpOptions);
            // Extract semicolon sentences
            let semicolonSentences = sentenceText.split(";");
            if (sentenceText.includes(";")) {
                semicolonSentences = semicolonSentences.map(
                    (semicolonSentence, index) => {
                        return index !== semicolonSentences.length - 1
                            ? `${semicolonSentence};`.trim()
                            : semicolonSentence.trim();
                    }
                );
            }
            newSentences = newSentences.concat(semicolonSentences);
        });
        return newSentences;
    }

    parseSentence(sentenceContent, paragraphDataHash) {
        const sentenceId = this.createSentenceId();
        const sentenceDataHash = md5(
            `${paragraphDataHash}${this.sentenceSequence}${sentenceContent}`
        );

        return this.sentenceService.create({
            data_hash: sentenceDataHash,
            props: {
                id: sentenceId,
            },
            content: sentenceContent,
        });
    }

    createParagraphId() {
        this.paragraphSequence++;
        return this.paragraphSequence;
    }

    createSentenceId() {
        this.sentenceSequence++;
        return this.sentenceSequence;
    }
}
