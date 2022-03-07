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
            .skip(page * pageSize)
            .limit(pageSize)
            .sort({ _id: order })
            .lean();
        return Promise.all(
            /** Get lastest revision for each claim */
            claims.map(async (claim) => {
                let claimRevision = await this.claimRevisionService.getRevision(claim._id)
                return this.postProcess({
                    ...claim,
                    ...claimRevision.toObject()
                });
            })
        );
    }

    count(query: any = {}) {
        return this.ClaimModel.countDocuments().where(query);
    }

    async create(claim) {
        /** create an ID to claim */
        claim.personality = new Types.ObjectId(claim.personality);
        /** create a new schema to claim */
        const newClaim = new this.ClaimModel(claim);
        /** Save claim in database */
        newClaim.save();
        /** Create a new claimRevision passing claim ID and the props received from the req/dto */
        const newClaimRevision = await this.claimRevisionService.create(newClaim._id, claim)
        /**Return an object with claim and claimReview props */
        return {
            ...newClaim.toObject(),
            ...newClaimRevision.toObject()
        }
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
        const claimRevision = await this.claimRevisionService.getRevision(claimId)
        const claim = await this.ClaimModel.findById(claimId)
            .populate("personality", "_id name")
            .populate("sources", "_id link classification");
        // TODO: get the latest revision
        /** If claim and claimRevision are false, nothing is returned */
        if (!claim && !claimRevision) {
            // TODO: handle 404 for claim not found
            return {};
        }

        return this.postProcess({
            ...claim.toObject(),
            ...claimRevision.toObject()
        });
    }

    async getByPersonalityIdAndClaimSlug(personalityId, claimSlug) {
        const claimRevision = await this.claimRevisionService.getRevisionBySlug(claimSlug)
        const claim = 
            await this.ClaimModel.findOne({
                personality: personalityId,
            })
            .populate("personality", "_id name")
            .populate("sources", "_id link classification");
            // TODO: get latest revision
        if (!claim && !claimRevision) {
            return {}; // TODO: this conditional is being used in other parts of the code
        }
        /**Return an object with claim and claimReview props */
        return this.postProcess({
            ...claim.toObject(),
            ...claimRevision.toObject()
        });
    }

    /**
     * This function return all personality claims
     * @param claim all personality claims
     * @returns return all claims
     */
    private async postProcess(claim) {
        /** Claim param return all claims */
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
