import { IsNotEmpty, IsObject, IsString } from "class-validator";

import { ClassificationEnum } from "../../claim-review/dto/create-claim-review.dto";
import { Claim } from "../../claim/schemas/claim.schema";
import { Personality } from "../../personality/schemas/personality.schema";
import { User } from "../../users/schemas/user.schema";
import { ApiProperty } from "@nestjs/swagger";

export type ReviewTaskMachineContextReviewData = {
    usersId?: any[];
    summary?: string;
    questions?: string[];
    report?: string;
    verification?: string;
    sources?: string[] | object[];
    classification?: ClassificationEnum;
    data_hash?: string;
    reviewerId?: any;
    rejectionComment?: string;
    editor?: any;
    reviewDataHtml?: ReviewTaskMachineContextReviewData;
    comments?: any[];
};

export type ReviewTaskMachineContext = {
    reviewData: ReviewTaskMachineContextReviewData;
    claimReview: {
        usersId?: User[];
        data_hash: string;
        personality: Personality;
        claim: Claim;
        isPartialReview: boolean;
    };
    preloadedOptions: {
        usersId?: any[];
        reviewerId?: any[];
    };
};

export type Machine = {
    context: ReviewTaskMachineContext;
    value: string;
};

export class CreateClaimReviewTaskDTO {
    @IsNotEmpty()
    @IsObject()
    @ApiProperty()
    machine: Machine;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    data_hash: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    recaptcha: string;

    @IsString()
    @ApiProperty()
    nameSpace: string;
}
