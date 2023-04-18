import {
    ArrayNotEmpty,
    IsEnum,
    IsArray,
    IsDateString,
    IsNotEmpty,
    IsString,
    ArrayMinSize,
} from "class-validator";
import { ContentModelEnum } from "../../types/enums";
import { Personality } from "../../personality/schemas/personality.schema";

export class CreateDebateClaimDTO {
    @IsNotEmpty()
    @IsString()
    title: string;

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

    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(2)
    personalities: Personality[];
}
