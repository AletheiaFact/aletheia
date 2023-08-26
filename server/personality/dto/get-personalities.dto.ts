import { ApiProperty } from "@nestjs/swagger";
import {
    IsAlpha,
    IsBoolean,
    IsInt,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    Min,
} from "class-validator";
export class GetPersonalities {
    @IsNumber()
    @IsInt()
    @Min(0)
    @ApiProperty()
    page: number;

    @IsNumber()
    @Min(0)
    @ApiProperty()
    pageSize: number;

    @IsString()
    @ApiProperty()
    order: string;

    @IsString()
    @IsAlpha()
    @ApiProperty()
    language: string;

    @IsBoolean()
    @IsOptional()
    @ApiProperty()
    withSuggestions?: boolean;

    @IsString()
    @IsOptional()
    @ApiProperty()
    name?: string;

    @IsObject()
    @IsOptional()
    @ApiProperty()
    headers?: {
        [key: string]: string;
    };
}
