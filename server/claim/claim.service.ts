import {Injectable, Logger} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Claim, ClaimDocument } from "../claim/schemas/claim.schema";
import { ClaimReviewService } from "../claim-review/claim-review.service";
import { ParserService } from "../parser/parser.service";
import { SourceService } from "../source/source.service";
import { ClaimRevisionService } from "../claim-revision/claim-revision.service";

@Injectable()
export class ClaimService {
    private optionsToUpdate: { new: boolean; upsert: boolean };
    private readonly logger = new Logger("ClaimService");

    constructor(
        @InjectModel(Claim.name)
        private ClaimModel: Model<ClaimDocument>,
        private claimReviewService: ClaimReviewService,
        // TODO: inject ClaimRevisionService
        private claimRevisionService: ClaimRevisionService,
        private sourceService: SourceService,
        private parserService: ParserService
    ) {
        this.optionsToUpdate = {
            new: true,
            upsert: true,
        };
    }

    async listAll(page, pageSize, order, query) {
        if (query.personality) {
            query.personality = new Types.ObjectId(query.personality)
        }
        const claims = await this.ClaimModel.find(query)
            // TODO: get latest revision
            .skip(page * pageSize)
            .limit(pageSize)
            .sort({ _id: order })
            .lean();
        return Promise.all(
            claims.map((claim) => {
                return this.postProcess(claim);
            })
        );
    }

    count(query: any = {}) {
        return this.ClaimModel.countDocuments().where(query);
    }

    async create(claim) {
        // TODO: replace this function logic with this.claimRevisionService.create(claim)
    }

    async update(claimId, claimBody) {
        // TODO: when updating a claim a new claimRevision should be created as well
        // eslint-disable-next-line no-useless-catch
        try {
            const claim = await this.getById(claimId);
            claimBody.content = this.parserService.parse(claimBody.content);
            const newClaim = Object.assign(claim, claimBody);
            const claimUpdate = await this.ClaimModel.findByIdAndUpdate(
                claimId,
                newClaim,
                this.optionsToUpdate
            );
            return claimUpdate;
        } catch (error) {
            // TODO: log to service-runner
            throw error;
        }
    }

    delete(claimId) {
        // TODO: use soft-delete instead
        // this means that when deleting it should actually update
        // the deleted field with the boolean value 'true'
        return this.ClaimModel.findByIdAndRemove(claimId);
    }

    // TODO: add optional revisionId that will fetch a specifc revision that matches
    async getById(claimId) {
        const claim = await this.ClaimModel.findById(claimId)
            .populate("personality", "_id name")
            .populate("sources", "_id link classification");
            // TODO: get the latest revision
        if (!claim) {
            // TODO: handle 404 for claim not found
            return {};
        }

        return this.postProcess(claim.toObject());
    }

    async getByPersonalityIdAndClaimSlug(personalityId, claimSlug) {
        const claim =
            await this.ClaimModel.findOne({
                slug: claimSlug,
                personality: personalityId
            })
            .populate("personality", "_id name")
            .populate("sources", "_id link classification");
            // TODO: get latest revision
        if (!claim) {
            return {};
        }

        return this.postProcess(claim.toObject());
    }

    private async postProcess(claim) {
        // TODO: this will break when fetching the revision content
        const reviews = await this.claimReviewService.getReviewsByClaimId(
            claim._id
        );
        if (claim) {
            if (claim?.content?.object) {
                claim.content.object = this.transformContentObject(
                    claim.content.object,
                    reviews
                );
            }
            const reviewStats =
                await this.claimReviewService.getReviewStatsByClaimId(
                    claim._id
                );
            const overallStats = this.calculateOverallStats(claim);
            const stats = { ...reviewStats, ...overallStats };
            claim = Object.assign(claim, { stats });
        }

        return claim;
    }

    private calculateOverallStats(claim) {
        // TODO: this will break when fetching the revision content
        let totalClaims = 0;
        let totalClaimsReviewed = 0;
        if (claim?.content?.object) {
            claim.content.object.forEach((p) => {
                totalClaims += p.content.length;
                p.content.forEach((sentence) => {
                    if (sentence.props.topClassification) {
                        totalClaimsReviewed++;
                    }
                });
            }, 0);
        }
        return {
            totalClaims,
            totalClaimsReviewed,
        };
    }

    private transformContentObject(claimContent, reviews) {
        if (!claimContent || reviews.length <= 0) {
            return claimContent;
        }
        claimContent.forEach((paragraph, paragraphIndex) => {
            paragraph.content.forEach((sentence, sentenceIndex) => {
                const claimReview = reviews.find((review) => {
                    return review._id === sentence.props["data-hash"];
                });
                if (claimReview) {
                    claimContent[paragraphIndex].content[sentenceIndex].props =
                        Object.assign(sentence.props, {
                            topClassification: claimReview.topClassification,
                        });
                }
            });
        });
        return claimContent;
    }

    findOneAndUpdate(query, push) {
        return this.ClaimModel.findOneAndUpdate(
            { ...query },
            { $push: { ...push } },
            { new: true },
            (e) => {
                if (e) {
                    throw e;
                }
            }
        );
    }
}
