import { IsAlpha, IsArray, IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Personality } from "../../personality/schemas/personality.schema";

export class CreateClaim {
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

    @IsString()
    @IsAlpha()
    type: string;

    @IsOptional()
    @IsArray()
    sources: string[];

    @IsString()
    recaptcha: string;

    @IsOptional()
    @IsString()
    personality?: Personality;
}