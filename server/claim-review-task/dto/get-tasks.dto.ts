import {
    IsArray,
    IsInt,
    IsNumber,
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

    @IsArray()
    @IsOptional()
    usersId?: string[];
}
