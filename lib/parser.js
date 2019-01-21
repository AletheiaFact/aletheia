'use strict';

const fs = require('fs');
const path = require('path');
const dom = require('domino');
const md5 = require('md5');
const domimpl = dom.createDOMImplementation();


class Parser {
    constructor() {
        const html = fs.readFileSync(path.resolve('tests/parser', 'speech.html'), 'utf8');
        this.paragraphSequence = 0;
        this.sentenceSequence = 0;
        this.document = dom.createDocument(html);
    }

    parse() {
        let result = [],
            paragraphs = this.document.querySelectorAll('p');
        for (var i = 0; i < paragraphs.length; i++) {
            let paragraphId = this.createParagraphId(),
                paragraphContent = paragraphs[i].innerHTML,
                newParagraph = this.document.createElement('p'),
                sentences = paragraphContent.match(/[^\.\!\?]*[\.\!\?]/g);
            paragraphs[i].setAttribute('id', paragraphId);
            result[i] = {
                'element': 'p',
                'props': {
                    'id' : paragraphId,
                },
                'content': [],
            }
            sentences.forEach((sentence) => {
                result[i]['content'].push(this.parseSentence(sentence, newParagraph));
            });

            paragraphs[i].innerHTML = newParagraph.innerHTML;
        }
        return { 'html': this.document.innerHTML, 'object': result };
    }

    parseSentence(sentenceContent, newParagraph) {
        let span = this.document.createElement('span');
        let sentenceId = this.createSentenceId();
        span.setAttribute('id', sentenceId);
        let sentenceDataHash = md5(`${this.paragraphSequence}${this.sentenceSequence}${sentenceContent}`);
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
        }
    }

    createParagraphId() {
        this.paragraphSequence ++;
        return this.paragraphSequence;
    }

    createSentenceId() {
        this.sentenceSequence ++;
        return this.sentenceSequence;
    }
}

module.exports = Parser;
