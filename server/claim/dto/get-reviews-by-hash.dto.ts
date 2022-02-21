import { IsAlpha, IsArray, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class GetClaimsByHash {
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

    @IsOptional()
    @IsArray()
    reviews?: string[];
}