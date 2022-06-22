import { IsAlphanumeric, IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Personality } from "../../personality/schemas/personality.schema";
import { Claim } from "../../claim/schemas/claim.schema";
import { ClassificationEnum } from "../../report/schemas/report.schema"

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

    @IsString()
    recaptcha: string

    @IsNotEmpty()
    @IsArray()
    sources: string[]
}