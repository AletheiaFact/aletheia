import { IsNotEmpty, IsString, IsObject } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../users/schemas/user.schema";

interface SourceProps {
    textRange?: string[];
    summary: string;
    classification: string;
    field?: string;
    targetText?: string;
    sup?: number;
    id?: string;
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

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    recaptcha: string;
}
