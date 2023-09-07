import { Roles, Status } from "../../auth/ability/ability.factory";
import { IsArray, IsOptional, IsString } from "class-validator";
import { Badge } from "../../badge/schemas/badge.schema";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDTO {
    @IsString()
    @IsOptional()
    @ApiProperty()
    role: Roles;

    @IsArray()
    @IsOptional()
    @ApiProperty()
    badges: Badge[];

    @IsString()
    @IsOptional()
    @ApiProperty()
    state: Status;
}
