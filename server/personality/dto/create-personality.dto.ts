import { IsBoolean, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
export class CreatePersonality {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    name: string;

    @IsString()
    description: string;

    @IsString()
    wikidata: string;

    @IsString()
    @IsOptional()
    P2013?: string;

    @IsString()
    @IsOptional()
    instagramUsername?: string;

    @IsString()
    @IsOptional()
    P2002?: string;

    @IsBoolean()
    @IsOptional()
    isAllowedProp?: boolean

    @IsString()
    @IsOptional()
    image?: string

    @IsString()
    @IsOptional()
    wikipedia?: string
}