import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { User } from '../../users/schemas/user.schema';
import { ClassificationEnum } from '../../report/schemas/report.schema';
import { Personality } from '../../personality/schemas/personality.schema';
import { Claim } from '../../claim/schemas/claim.schema';

export type ReviewTaskMachineContext = {
    reviewData: {
        userId?: User;
        summary?: string;
        questions?: string[];
        report?: string;
        verification?: string;
        sources?: string[];
        classification?: ClassificationEnum;
        personality: Personality;
        claim: Claim;
    }
}

export type Machine = {
    context: ReviewTaskMachineContext;
    value: string;
}

export class CreateClaimReviewTaskDTO {
    @IsNotEmpty()
    @IsObject()
    machine: Machine;

    @IsNotEmpty()
    @IsString()
    sentence_hash: string;
}
