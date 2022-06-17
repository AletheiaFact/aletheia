import {
    IsAlphanumeric,
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsString,
} from "class-validator";
import { Personality } from "../../personality/schemas/personality.schema";
import { Claim } from "../../claim/schemas/claim.schema";
import { ClassificationEnum } from "../schemas/claim-review.schema";

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

    @IsString()
    sentence_content: string;

    @IsNotEmpty()
    @IsString()
    report: string;

    @IsNotEmpty()
    @IsArray()
    sources: string[];
}
