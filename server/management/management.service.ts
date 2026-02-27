import { Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { ClaimService } from "../claim/claim.service";
import { ClaimReviewService } from "../claim-review/claim-review.service";
import type { IPersonalityService } from "../interfaces/personality.service.interface";

@Injectable()
export class ManagementService {
    private readonly logger = new Logger(ManagementService.name);

    constructor(
        @Inject("PersonalityService")
        private readonly personalityService: IPersonalityService,
        private readonly claimService: ClaimService,
        private readonly claimReviewService: ClaimReviewService,
    ) {}

    /**
     * Performs a full hierarchy soft delete starting from a Personality.
     * Path: Personality -> Claims -> ClaimReviews
     * @param personalityId The unique identifier of the personality.
     */
    async deletePersonalityHierarchy(personalityId: string): Promise<void> {
        this.logger.log(`Starting global cascade delete for personalityId: ${personalityId}`);
        try {
            const claims = await this.claimService.getByPersonalityId(personalityId);

            if (claims.length > 0) {
                this.logger.log(`Found ${claims.length} claims for personality ${personalityId}. Starting sub-cascades.`);

                for (const claim of claims) {
                    await this.deleteClaimHierarchy(claim._id);
                }
            }

            const deletedPersonality = await this.personalityService.delete(personalityId);
            this.logger.log(`Full hierarchy for personality ${personalityId} deleted successfully.`);

            return deletedPersonality
        } catch (error) {
            this.handleError(error, personalityId, 'personality');
        }
    }

    /**
     * Performs a soft delete on a claim and all its associated reviews.
     * @param claimId The unique identifier of the claim.
     */
    async deleteClaimHierarchy(claimId: string): Promise<void> {
        this.logger.log(`Starting cascade soft delete for claimId: ${claimId}`);

        try {
            const claimReviews = await this.claimReviewService.findPublishedReviewsByClaimId(claimId);

            if (claimReviews.length > 0) {
                this.logger.log(`Found ${claimReviews.length} associated claim reviews to delete for claimId: ${claimId}`);
                for (const review of claimReviews) {
                    await this.claimReviewService.delete(review._id);
                }
            }

            const deletedClaim = await this.claimService.delete(claimId);
            this.logger.log(`Cascade soft delete completed successfully for claimId: ${claimId}`);

            return deletedClaim;
        } catch (error) {
            this.handleError(error, claimId, 'claim');
        }
    }

    /**
     * Standardized error handling for cascade delete operations, ensuring consistent logging and exception throwing.
     */
    private handleError(error: any, id: string, context: string): void {
        if (error instanceof NotFoundException) {
            this.logger.warn(`Resource for deletion not found: [${context}] ID ${id}`);
            throw error;
        }

        this.logger.error(
            `Failed to execute cascade delete for [${context}] ID: ${id}`,
            error.stack,
        );

        throw new InternalServerErrorException(
            `Internal server error while processing cascade delete for ${context}.`
        );
    }
}
