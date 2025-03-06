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
import { Personality } from "../../personality/mongo/schemas/personality.schema";
import { ApiProperty } from "@nestjs/swagger";

export class CreateDebateClaimDTO {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    title: string;

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
    @ArrayMinSize(2)
    @ApiProperty()
    personalities: Personality[];

    @IsString()
    @ApiProperty()
    nameSpace: string;
}
