import { IsAlpha, IsBoolean, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
export class GetPersonalities {
    @IsNumber()
    @IsInt()
    @Min(0)
    page: number;

    @IsNumber()
    @Min(0)
    pageSize: number;//error /personality/search, 10 by default

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
}