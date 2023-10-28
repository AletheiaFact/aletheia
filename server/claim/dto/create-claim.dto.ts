import {
    ArrayNotEmpty,
    IsEnum,
    IsArray,
    IsDateString,
    IsNotEmpty,
    IsString,
    IsOptional,
} from "class-validator";
import { ContentModelEnum } from "../../types/enums";
import { Personality } from "../../personality/schemas/personality.schema";
import { ApiProperty } from "@nestjs/swagger";

export class CreateClaimDTO {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    title: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    content: string;

    @IsNotEmpty()
    @IsString()
    @IsDateString()
    @ApiProperty()
    date: string;

    @IsNotEmpty()
    @IsString()
    @IsEnum(ContentModelEnum)
    @ApiProperty()
    contentModel: string;

    @IsArray()
    @ArrayNotEmpty()
    @ApiProperty()
    sources: string[];

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    recaptcha: string;

    @IsArray()
    @ArrayNotEmpty()
    @ApiProperty()
    personalities: Personality[];

    @IsString()
    @ApiProperty()
    nameSpace: string;
}
