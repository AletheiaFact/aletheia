import {Injectable} from "@nestjs/common";
import {ClaimReviewService} from "../claim-review/claim-review.service";
import {PersonalityService} from "../personality/personality.service";
import {ClaimService} from "../claim/claim.service";

@Injectable()
export class StatsService {
    constructor(
        private claimReviewService: ClaimReviewService,
        private personalityService: PersonalityService,
        private claimService: ClaimService
    ) {}

    getHomeStats() {
        return Promise.all([
            this.claimService.count(),
            this.personalityService.count(),
            this.claimReviewService.count(),
        ]).then((values) => {
            return {
                claims: values[0],
                personalities: values[1],
                reviews: values[2],
            };
        });
    }
}
