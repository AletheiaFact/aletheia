import {
    IsAlphanumeric,
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
} from "class-validator";
import { Personality } from "../../personality/schemas/personality.schema";
import { Claim } from "../../claim/schemas/claim.schema";
import { ApiProperty } from "@nestjs/swagger";

export enum ClassificationEnum {
    "not-fact" = 0,
    "false",
    "misleading",
    "unsustainable",
    "unverifiable",
    "exaggerated",
    "arguable",
    "trustworthy-but",
    "trustworthy",
}

export class CreateClaimReview {
    @IsNotEmpty()
    @IsString()
    @IsEnum(ClassificationEnum)
    @ApiProperty()
    classification: string;

    @IsString()
    @IsAlphanumeric()
    @ApiProperty()
    claim: Claim;

    @IsOptional()
    @IsAlphanumeric()
    @ApiProperty()
    personality?: Personality;

    @IsString()
    @IsAlphanumeric()
    @ApiProperty()
    data_hash: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    report: string;

    @IsNotEmpty()
    @IsArray()
    @ApiProperty()
    sources: string[];
}
