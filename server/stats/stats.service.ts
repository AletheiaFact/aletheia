import { Inject, Injectable, Scope } from "@nestjs/common";
import { ClaimReviewService } from "../claim-review/claim-review.service";
import { ClaimService } from "../claim/claim.service";
import { REQUEST } from "@nestjs/core";
import type { BaseRequest } from "../types";
import { NameSpaceEnum } from "../auth/name-space/schemas/name-space.schema";
import { IPersonalityService } from "../interfaces/personality.service.interface";

@Injectable({ scope: Scope.REQUEST })
export class StatsService {
    constructor(
        @Inject(REQUEST) private req: BaseRequest,
        private claimReviewService: ClaimReviewService,
        @Inject("PersonalityService")
        @Inject("PersonalityService")
        private personalityService: IPersonalityService,
        private claimService: ClaimService
    ) {}

    getHomeStats() {
        return Promise.all([
            this.claimService.count({
                isHidden: false,
                isDeleted: false,
                nameSpace: this.req.params.namespace || NameSpaceEnum.Main,
            }),
            this.personalityService.count({
                isHidden: false,
                isDeleted: false,
            }),
            this.claimReviewService.count({
                isHidden: false,
                isDeleted: false,
                nameSpace: this.req.params.namespace || NameSpaceEnum.Main,
            }),
        ]).then((values) => {
            return {
                claims: values[0],
                personalities: values[1],
                reviews: values[2],
            };
        });
    }
}
