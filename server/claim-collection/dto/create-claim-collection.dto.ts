import { IsArray, IsDate, IsNotEmpty, IsString } from "class-validator";

import { Personality } from "../../personality/schemas/personality.schema";

export class CreateClaimCollectionDto {
    // TODO: How to deal with recaptcha for the editor?
    // @IsNotEmpty()
    // @IsString()
    // recaptcha: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsArray()
    @IsNotEmpty()
    personalities: Personality[];

    @IsDate()
    @IsNotEmpty()
    date: Date;
}
