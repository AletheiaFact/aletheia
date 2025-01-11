import { ApiProperty } from "@nestjs/swagger";
import {
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    Min,
} from "class-validator";
import { ReviewTaskTypeEnum } from "../../types/enums";

export class GetTasksDTO {
    @IsNumber()
    @IsInt()
    @Min(0)
    page: number;

    @IsNumber()
    @Min(0)
    pageSize: number;

    @IsString()
    order: string;

    @IsString()
    value: string;

    @IsObject()
    @IsOptional()
    filterUser?: {
        assigned: boolean;
        crossChecked: boolean;
        reviewed: boolean;
    };

    @IsString()
    @IsOptional()
    nameSpace?: string;

    @IsNotEmpty()
    @IsEnum(ReviewTaskTypeEnum)
    @ApiProperty()
    reviewTaskType: ReviewTaskTypeEnum;
}
