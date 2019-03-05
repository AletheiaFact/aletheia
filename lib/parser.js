'use strict';

const dom = require('domino');
const md5 = require('md5');

class Parser {
    constructor(html) {
        this.html = html;
        this.paragraphSequence = 0;
        this.sentenceSequence = 0;
    }

    parse() {
        let document = dom.createDocument(this.html);
        const result = [];
        const paragraphs = document.querySelectorAll('p');

        for (let i = 0; i < paragraphs.length; i++) {
            const paragraphId = this.createParagraphId();
            const paragraphContent = paragraphs[i].innerHTML;
            const newParagraph = document.createElement('p');
            // eslint-disable-next-line no-useless-escape
            const sentences = paragraphContent.match(/[^\.\!\?]*[\.\!\?]/g);

            paragraphs[i].setAttribute('id', paragraphId);
            result[i] = {
                'element': 'p',
                'props': {
                    'id' : paragraphId,
                },
                'content': [],
            };

            if (sentences){
                sentences.forEach((sentence) => {
                    result[i].content.push(this.parseSentence(document, sentence, newParagraph));
                });
            }

            paragraphs[i].innerHTML = newParagraph.innerHTML;
        }
        return { 'html': document.innerHTML, 'object': result };
    }

    parseSentence(document, sentenceContent, newParagraph) {
        const span = document.createElement('span');
        const sentenceId = this.createSentenceId();
        span.setAttribute('id', sentenceId);
        const sentenceDataHash =
            md5(`${this.paragraphSequence}${this.sentenceSequence}${sentenceContent}`);
        span.setAttribute('data-hash', sentenceDataHash);
        span.innerHTML = sentenceContent;

        newParagraph.appendChild(span);
        return {
            'element': 'span',
            'props': {
                'id': sentenceId,
                'data-hash': sentenceDataHash,
            },
            'content': sentenceContent,
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

module.exports = Parser;
