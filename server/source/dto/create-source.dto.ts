import { IsNotEmpty, IsString, IsObject } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../users/schemas/user.schema";

export interface SourceProps {
    textRange?: string[];
    summary: string;
    classification: string;
    field?: string;
    targetText?: string;
    sup?: number;
    id?: string;
    date?: Date;
}

export class CreateSourceDTO {
    @IsString()
    @ApiProperty()
    href: string;

    @IsNotEmpty()
    @IsObject()
    @ApiProperty()
    props: SourceProps;

    @IsString()
    @ApiProperty()
    user: User;

    @IsString()
    @ApiProperty()
    nameSpace: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    recaptcha: string;
}
