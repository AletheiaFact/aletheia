import {
    IsAlphanumeric,
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
} from "class-validator";
import { Personality } from "../../personality/mongo/schemas/personality.schema";
import { Claim } from "../../claim/mongo/schemas/claim.schema";
import { ApiProperty } from "@nestjs/swagger";
import { ClassificationEnum } from "../../../lib/classification";

export { ClassificationEnum };

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
