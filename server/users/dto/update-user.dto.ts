import { Roles, Status } from "../../auth/ability/ability.factory";
import {
    IsArray,
    IsBoolean,
    IsObject,
    IsOptional,
    IsString,
} from "class-validator";
import { Badge } from "../../badge/schemas/badge.schema";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDTO {
    @IsObject()
    @IsOptional()
    @ApiProperty()
    role: object;

    @IsArray()
    @IsOptional()
    @ApiProperty()
    badges: Badge[];

    @IsString()
    @IsOptional()
    @ApiProperty()
    state: Status;

    @IsBoolean()
    @IsOptional()
    @ApiProperty()
    totp: boolean;
}
