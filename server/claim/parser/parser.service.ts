import { Inject, Injectable } from "@nestjs/common";
import type { ISentenceService } from "../../interfaces/sentence.service.interface";
import type { IParagraphService } from "../../interfaces/paragraph.service.interface";
import type { ISpeechService } from "../../interfaces/speech.service.interface";
import type { IUnattributedService } from "../../interfaces/unattributed.service.interface";
import type {
    ISpeech,
    IUnattributed,
} from "../../interfaces/claim-content.interface";
import { ContentModelEnum } from "../../types/enums";
import { SentenceHashService } from "../admin-editor/sentence-hash.service";
const nlp = require("compromise");
nlp.extend(require("compromise-sentences"));
nlp.extend(require("compromise-paragraphs"));

@Injectable()
export class ParserService {
    constructor(
        @Inject("SpeechService") private speechService: ISpeechService,
        @Inject("ParagraphService")
        private paragraphService: IParagraphService,
        @Inject("SentenceService") private sentenceService: ISentenceService,
        @Inject("UnattributedService")
        private unattributedService: IUnattributedService,
        private hashService: SentenceHashService
    ) {}
    paragraphSequence: number;
    sentenceSequence: number;
    nlpOptions: object = { trim: true };

    async parse(
        content: string,
        claimRevisionId: string | object,
        personality: string | null = null,
        contentModel = ContentModelEnum.Speech
    ): Promise<ISpeech | IUnattributed> {
        this.paragraphSequence = 0;
        this.sentenceSequence = 0;
        const result: Promise<any>[] = [];
        const nlpContent = nlp(content);
        const paragraphs = nlpContent.paragraphs();
        const text = nlpContent.text(this.nlpOptions);

        paragraphs.forEach((paragraph: any) => {
            const paragraphId = this.createParagraphId();
            const sentences = this.postProcessSentences(paragraph.sentences());

            const paragraphDataHash = this.hashService.computeParagraphHash(
                this.paragraphSequence,
                text,
                paragraph
            );

            if (sentences && sentences.length) {
                return result.push(
                    this.paragraphService.create({
                        data_hash: paragraphDataHash,
                        props: {
                            id: paragraphId,
                        },
                        claimRevisionId: claimRevisionId,
                        content: sentences.map((sentence) =>
                            this.parseSentence(
                                sentence,
                                paragraphDataHash,
                                claimRevisionId
                            )
                        ),
                    })
                );
            }
        });

        return await Promise.all(result).then(
            (object: any[]): Promise<ISpeech | IUnattributed> => {
                if (contentModel === ContentModelEnum.Unattributed) {
                    return this.unattributedService.create({
                        content: object,
                    });
                }

                return this.speechService.create({
                    content: object,
                    claimRevisionId: claimRevisionId,
                    personality: personality || null,
                });
            }
        );
    }

    postProcessSentences(sentences: any) {
        let newSentences: string[] = [];
        sentences.forEach((sentence: any) => {
            const sentenceText = sentence.text(this.nlpOptions);
            let semicolonSentences = sentenceText.split(";");
            if (sentenceText.includes(";")) {
                semicolonSentences = semicolonSentences.map(
                    (semicolonSentence: string, index: number) => {
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

    parseSentence(
        sentenceContent: string,
        paragraphDataHash: string,
        claimRevisionId: string | object
    ) {
        const sentenceId = this.createSentenceId();
        const sentenceDataHash = this.hashService.computeSentenceHash(
            paragraphDataHash,
            this.sentenceSequence,
            sentenceContent
        );

        return this.sentenceService.create({
            data_hash: sentenceDataHash,
            props: {
                id: sentenceId,
            },
            content: sentenceContent,
            claimRevisionId: claimRevisionId,
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
