import { Injectable } from "@nestjs/common";

const md5 = require("md5");

// MD5-based hashing for paragraph + sentence `data_hash`.
// Formulas MUST stay byte-for-byte identical to parser.service.ts to keep
// historical data_hash values stable across ReviewTask, ClaimReview,
// VerificationRequest, and Sentence collections.
@Injectable()
export class SentenceHashService {
    computeParagraphHash(
        paragraphSequence: number,
        text: string,
        paragraph: unknown
    ): string {
        return md5(`${paragraphSequence}${text}${paragraph}`);
    }

    computeSentenceHash(
        paragraphDataHash: string,
        sentenceSequence: number,
        content: string
    ): string {
        return md5(`${paragraphDataHash}${sentenceSequence}${content}`);
    }
}
