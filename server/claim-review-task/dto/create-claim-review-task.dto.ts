import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { User } from '../../users/schemas/user.schema';
import { ClassificationEnum } from '../../claim-review/schemas/claim-review.schema';

export type ReviewTaskMachineContext = {
    reviewData: {
        userId?: User;
        summary?: string;
        questions?: string[];
        report?: string;
        verification?: string;
        source?: string[];
        classification?: ClassificationEnum;
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
