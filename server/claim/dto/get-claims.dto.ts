import { IsAlpha, IsInt, IsNumber, IsString, Min } from 'class-validator';
export class GetClaims {
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

    @IsString()
    personality: string;
}