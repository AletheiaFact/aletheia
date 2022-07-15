import {
    ArrayNotEmpty,
    IsEnum,
    IsArray,
    IsDateString,
    IsNotEmpty,
    IsString,
} from "class-validator";
import { ContentModelEnum } from "../../claim-revision/schema/claim-revision.schema";
import { Personality } from "../../personality/schemas/personality.schema";

export class CreateClaimDTO {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsString()
    @IsDateString()
    date: string;

    @IsNotEmpty()
    @IsString()
    @IsEnum(ContentModelEnum)
    contentModel: string;

    @IsArray()
    @ArrayNotEmpty()
    sources: string[];

    @IsNotEmpty()
    @IsString()
    recaptcha: string;

    @IsNotEmpty()
    @IsString()
    personality: Personality;
}
