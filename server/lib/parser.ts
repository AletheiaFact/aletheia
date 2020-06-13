const dom = require("domino");
const md5 = require("md5");

// TODO: regex for future rules
// const alphabets = /([A-Za-z])/g;
// const prefixes = /(Mr|St|Mrs|Ms|Dr)[.]/g;
// const phdRegex = /Ph\.D\./g;
// const suffixes = /(Inc|Ltd|Jr|Sr|Co)/g;
// const starters = /(Mr|Mrs|Ms|Dr|He\s|She\s|It\s|They\s|Their\s|Our\s|We\s|But\s|However\s|That\s|This\s|Wherever)/g;
// const acronyms = /([A-Z][.][A-Z][.](?:[A-Z][.])?)/g;
// const websites = /[.](com|net|org|io|gov)/g;

class Parser {
    paragraphSequence: number;
    sentenceSequence: number;

    constructor() {
        this.paragraphSequence = 0;
        this.sentenceSequence = 0;
    }

    parse(html: string) {
        const document = dom.createDocument(html);
        const text = document.body.textContent;
        const result = [];
        const paragraphs = document.querySelectorAll("p");

        for (let i = 0; i < paragraphs.length; i++) {
            const paragraphId = this.createParagraphId();
            const paragraphContent = paragraphs[i].innerHTML;
            const newParagraph = document.createElement("p");
            const sentences = this.extractSentences(paragraphContent);

            if (Array.isArray(sentences) && sentences.length) {
                result.push({
                    element: "p",
                    props: {
                        id: paragraphId
                    },
                    content: sentences.map(sentence => {
                        return this.parseSentence(
                            document,
                            sentence,
                            newParagraph
                        );
                    })
                });
            }
        }
        return { object: result, text };
    }

    /**
     * Extract sentences from a string text
     * Source: https://stackoverflow.com/questions/4576077/how-can-i-split-a-text-into-sentences
     * @param {String} text
     */
    extractSentences(text: string) {
        text = text.replace(/<br>/g, "");
        // TODO: there are more rules that should be applied in the future, see source
        text = text.replace(/\./g, ".<stop>");
        text = text.replace(/\?/g, "?<stop>");
        text = text.replace(/!/g, "!<stop>");
        return text.split("<stop>").filter(s => {
            return s && s.length !== 0;
        });
    }

    parseSentence(document, sentenceContent, newParagraph) {
        const span = document.createElement("span");
        const sentenceId = this.createSentenceId();
        span.setAttribute("id", sentenceId);
        const sentenceDataHash = md5(
            `${this.paragraphSequence}${this.sentenceSequence}${sentenceContent}`
        );
        span.setAttribute("data-hash", sentenceDataHash);
        span.innerHTML = sentenceContent;

        newParagraph.appendChild(span);
        return {
            element: "span",
            props: {
                id: sentenceId,
                "data-hash": sentenceDataHash
            },
            content: sentenceContent
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

export default Parser;
