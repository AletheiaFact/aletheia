import { Injectable } from "@nestjs/common";
import { SentenceService } from "../sentence/sentence.service";
import { ParagraphService } from "../paragraph/paragraph.service";
import { SpeechService } from "../speech/speech.service";
import { SpeechDocument } from "../speech/schemas/speech.schema";
const md5 = require("md5");
const nlp = require("compromise");
nlp.extend(require("compromise-sentences"));
nlp.extend(require("compromise-paragraphs"));

/* TODO: regex for future rules
 * alphabets /([A-Za-z])/g;
 * prefixes /(Mr|St|Mrs|Ms|Dr)[.]/g;
 * phdRegex /Ph\.D\./g;
 * suffixes "(Inc|Ltd|Jr|Sr|Co)";
 * starters /(Mr|Mrs|Ms|Dr|He\s|She\s|It\s|They\s|Their\s|Our\s|We\s|But\s|However\s|That\s|This\s|Wherever)/g;
 * acronyms /([A-Z][.][A-Z][.](?:[A-Z][.])?)/g;
 * websites /[.](com|net|org|io|gov)/g; */

@Injectable()
export class ParserService {
    constructor(
        private speechService: SpeechService,
        private paragraphService: ParagraphService,
        private sentenceService: SentenceService
    ) {}
    paragraphSequence: number;
    sentenceSequence: number;
    nlpOptions: object = { trim: true };

    async parse(content: string): Promise<SpeechDocument> {
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

        return await Promise.all(result).then(
            (object): Promise<SpeechDocument> => {
                return this.speechService.create({ content: object });
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
