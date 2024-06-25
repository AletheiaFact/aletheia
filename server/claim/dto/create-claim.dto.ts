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
import { Group } from "../../group/schemas/group.schema";

export class CreateClaimDTO {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    title: string;

    @IsNotEmpty()
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
    @IsOptional()
    personalities?: Personality[];

    @IsString()
    @ApiProperty()
    nameSpace: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    group: Group;
}
