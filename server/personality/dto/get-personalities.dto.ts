import {
    IsAlpha,
    IsBoolean,
    IsInt,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    Min,
    ValidateNested,
} from "class-validator";
export class GetPersonalities {
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
    @IsAlpha()
    language: string;

    @IsBoolean()
    @IsOptional()
    withSuggestions?: boolean;

    @IsString()
    @IsOptional()
    name?: string;

    @IsObject()
    @IsOptional()
    headers?: {
        [key: string]: string;
    };
}
