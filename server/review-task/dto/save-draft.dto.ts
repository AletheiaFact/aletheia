import {
    IsNotEmpty,
    IsObject,
    IsOptional,
    IsBoolean,
    IsString,
    IsArray,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ReviewTaskMachineContextReviewData } from "./create-review-task.dto";

class SaveDraftReview {
    @IsOptional()
    @IsArray()
    @ApiProperty()
    usersId?: string[];

    @IsOptional()
    @IsString()
    @ApiProperty()
    personality?: string;

    @IsOptional()
    @IsBoolean()
    @ApiProperty()
    isPartialReview?: boolean;

    @IsOptional()
    @IsString()
    @ApiProperty()
    targetId?: string;
}

class SaveDraftContext {
    @IsOptional()
    @IsObject()
    @ApiProperty()
    reviewData?: Partial<ReviewTaskMachineContextReviewData>;

    @IsOptional()
    @IsObject()
    @ApiProperty()
    review?: SaveDraftReview;
}

class SaveDraftMachine {
    @IsNotEmpty()
    @IsObject()
    @ApiProperty()
    context: SaveDraftContext;
}

export class SaveDraftDTO {
    @IsNotEmpty()
    @IsObject()
    @ApiProperty()
    machine: SaveDraftMachine;

    @IsOptional()
    @IsString()
    @ApiProperty()
    reportModel?: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    nameSpace?: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    reviewTaskType?: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    target?: string;
}
