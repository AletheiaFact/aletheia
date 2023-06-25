import {
    IsAlpha,
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    Min,
} from "class-validator";
export class GetClaimsDTO {
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

    @IsString()
    @IsOptional()
    personality: string;
}
