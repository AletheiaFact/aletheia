import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserDTO {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    name: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    email: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    password: string;
}
