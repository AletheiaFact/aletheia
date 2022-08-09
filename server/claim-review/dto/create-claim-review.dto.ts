import {
    IsAlphanumeric,
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsString,
} from "class-validator";
import { Personality } from "../../personality/schemas/personality.schema";
import { Claim } from "../../claim/schemas/claim.schema";

export enum ClassificationEnum {
    "not-fact" = 0,
    "false",
    "misleading",
    "unsustainable",
    "unverifiable",
    "exaggerated",
    "arguable",
    "true-but",
    "trustworthy",
}

export class CreateClaimReview {
    @IsNotEmpty()
    @IsString()
    @IsEnum(ClassificationEnum)
    classification: string;

    @IsString()
    @IsAlphanumeric()
    claim: Claim;

    @IsAlphanumeric()
    personality: Personality;

    @IsString()
    @IsAlphanumeric()
    sentence_hash: string;

    @IsNotEmpty()
    @IsString()
    report: string;

    @IsNotEmpty()
    @IsArray()
    sources: string[];
}
