import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { User } from "../../../users/schemas/user.schema";

export class CreateNameSpaceDTO {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    slug: string;

    @IsArray()
    @IsOptional()
    @ApiProperty()
    users: User[];
}
