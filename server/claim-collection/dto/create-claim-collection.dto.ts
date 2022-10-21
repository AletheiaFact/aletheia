import {
    IsArray,
    IsDate,
    IsNotEmpty,
    IsObject,
    IsString,
} from "class-validator";

import { Personality } from "../../personality/schemas/personality.schema";

export class CreateClaimCollectionDto {
    // TODO: How to deal with recaptcha for the editor?
    // @IsNotEmpty()
    // @IsString()
    // recaptcha: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsObject()
    @IsNotEmpty()
    editorContentObject: any; // TODO: define a type for the editor content object

    @IsArray()
    @IsNotEmpty()
    personalities: Personality[];

    @IsDate()
    @IsNotEmpty()
    date: Date;
}
