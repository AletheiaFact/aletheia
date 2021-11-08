import { Injectable } from "@nestjs/common";
const md5 = require("md5");
const nlp = require('compromise')
nlp.extend(require('compromise-sentences'))
nlp.extend(require('compromise-paragraphs'))

// TODO: regex for future rules
// const alphabets = /([A-Za-z])/g;
const prefixes = /(Mr|St|Mrs|Ms|Dr)[.]/g;
const phdRegex = /Ph\.D\./g;
// const suffixes = "(Inc|Ltd|Jr|Sr|Co)";
// const starters = /(Mr|Mrs|Ms|Dr|He\s|She\s|It\s|They\s|Their\s|Our\s|We\s|But\s|However\s|That\s|This\s|Wherever)/g;
// const acronyms = /([A-Z][.][A-Z][.](?:[A-Z][.])?)/g;
// const websites = /[.](com|net|org|io|gov)/g;

@Injectable()
export class ParserService {
    paragraphSequence: number;
    sentenceSequence: number;

    parse(content: string) {
        this.paragraphSequence = 0;
        this.sentenceSequence = 0;
        const result = [];
        const nlpContent = nlp(content)
        const nlpOptions = { trim:true };
        const paragraphs = nlpContent.paragraphs()

        paragraphs.forEach((paragraph) => {
            const paragraphId = this.createParagraphId();
            const sentences = paragraph.sentences();

            if (sentences && sentences.length) {
                result.push({
                    type: "paragraph",
                    props: {
                        id: paragraphId,
                    },
                    content: sentences.map((sentence) => this.parseSentence(sentence.text(nlpOptions))),
                });
            }
        });

        return {
            object: result,
            text: nlpContent.text(nlpOptions),
        };
    }

    /**
     * Extract sentences from a string text
     * Source: https://stackoverflow.com/questions/4576077/how-can-i-split-a-text-into-sentences
     * @param {String} text
     */
    extractSentences(text: string) {
        text = text.replace(/<br>/g, "");
        // TODO: there are more rules that should be applied in the future, see source
        text = text.replace(phdRegex, "Ph<prd>D<prd>");
        text = text.replace(prefixes, "$1<prd>");
        text = text.replace(/\./g, ".<stop>");
        text = text.replace(/\?/g, "?<stop>");
        text = text.replace(/!/g, "!<stop>");
        text = text.replace(/<prd>/g, ".");
        return text.split("<stop>").filter((s) => {
            return s && s.length !== 0;
        });
    }

    parseSentence(sentenceContent) {
        const sentenceId = this.createSentenceId();
        const sentenceDataHash = md5(
            `${this.paragraphSequence}${this.sentenceSequence}${sentenceContent}`
        );

        return {
            type: "sentence",
            props: {
                id: sentenceId,
                "data-hash": sentenceDataHash,
            },
            content: sentenceContent,
        };
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
