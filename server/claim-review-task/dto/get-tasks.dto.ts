import {
    IsInt,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    Min,
} from "class-validator";

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
        reviewerd: boolean;
    };

    @IsString()
    @IsOptional()
    nameSpace?: string;
}
