import { IsNotEmpty, IsObject, IsString } from "class-validator";
import { User } from "../../users/schemas/user.schema";
import { ClassificationEnum } from "../../claim-review/dto/create-claim-review.dto";
import { Personality } from "../../personality/schemas/personality.schema";
import { Claim } from "../../claim/schemas/claim.schema";

export type ReviewTaskMachineContext = {
    reviewData: {
        usersId?: any[];
        summary?: string;
        questions?: string[];
        report?: string;
        verification?: string;
        sources?: string[];
        classification?: ClassificationEnum;
        sentence_hash: string;
        revisorId?: string;
        rejectionComment?: string;
    };
    claimReview: {
        usersId?: User[];
        sentence_hash: string;
        personality: Personality;
        claim: Claim;
    };
};

export type Machine = {
    context: ReviewTaskMachineContext;
    value: string;
};

export class CreateClaimReviewTaskDTO {
    @IsNotEmpty()
    @IsObject()
    machine: Machine;

    @IsNotEmpty()
    @IsString()
    sentence_hash: string;

    @IsNotEmpty()
    @IsString()
    recaptcha: string;
}
