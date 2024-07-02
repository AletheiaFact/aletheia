import { IsEnum, IsNotEmpty, IsObject, IsString } from "class-validator";

import { ClassificationEnum } from "../../claim-review/dto/create-claim-review.dto";
import { Personality } from "../../personality/schemas/personality.schema";
import { User } from "../../users/schemas/user.schema";
import { ApiProperty } from "@nestjs/swagger";
import { ReportModelEnum } from "../../types/enums";

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
    editor?: any;
    reviewDataHtml?: ReviewTaskMachineContextReviewData;
    reviewComments?: any[];
    crossCheckingComment?: string;
    crossCheckingClassification?: string;
    crossCheckingComments?: any[];
    crossCheckerId?: any;
    group?: any[];
};

export type ReviewTaskMachineContext = {
    reviewData: ReviewTaskMachineContextReviewData;
    review: {
        usersId?: User[];
        personality: Personality;
        isPartialReview: boolean;
        targetId: string;
    };
    preloadedOptions: {
        usersId?: any[];
        reviewerId?: any[];
        crossCheckerId?: any[];
    };
};

export type Machine = {
    context: ReviewTaskMachineContext;
    value: string;
};

export class CreateReviewTaskDTO {
    @IsNotEmpty()
    @IsObject()
    @ApiProperty()
    machine: Machine;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    data_hash: string;

    @IsNotEmpty()
    @IsEnum(ReportModelEnum)
    @IsString()
    @ApiProperty()
    reportModel: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    recaptcha: string;

    @IsString()
    @ApiProperty()
    nameSpace: string;

    @IsString()
    @ApiProperty()
    target: string;
}
