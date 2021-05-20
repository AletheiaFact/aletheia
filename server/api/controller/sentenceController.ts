import ClaimRepository from "../repository/claim";
import { ILogger } from "../../lib/loggerInterface";
import ClaimReviewRepository from "../repository/claimReview";

export default class SentenceController {
    private claimReviewRepository: ClaimReviewRepository;
    private claimRepository: ClaimRepository;
    logger: ILogger;

    constructor({ logger }) {
        this.logger = logger;
        this.claimRepository = new ClaimRepository(logger);
        this.claimReviewRepository = new ClaimReviewRepository(logger);
    }

    async getByHashAndClaimId(sentenceHash, claimId) {
        const stats = await this.claimReviewRepository.getReviewStatsBySentenceHash(
            sentenceHash
        );
        const claimObj = await this.claimRepository.getById(claimId);
        let sentenceObj;

        claimObj.content.object.forEach(p => {
            p.content.forEach(sentence => {
                if (sentence.props["data-hash"] === sentenceHash) {
                    sentenceObj = sentence;
                }
            });
        });
        return {
            date: claimObj.date,
            personality: claimObj.personality,
            stats,
            ...sentenceObj
        };
    }

    async getReviewsByClaimIdAndSentenceHash(sentenceHash) {
        const reviews = await this.claimReviewRepository.getReviewsBySentenceHash(
            sentenceHash
        );
        return reviews;
    }
}
