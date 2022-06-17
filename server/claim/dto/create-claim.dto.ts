import {
    ArrayNotEmpty,
    IsAlpha,
    IsArray,
    IsDateString,
    IsNotEmpty,
    IsString,
} from "class-validator";

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
    @IsAlpha()
    type: string;

    @IsArray()
    @ArrayNotEmpty()
    sources: string[];

    @IsNotEmpty()
    @IsString()
    personality: Personality;
}
