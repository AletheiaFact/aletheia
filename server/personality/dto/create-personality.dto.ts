import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreatePersonality {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    wikidata: string;

}