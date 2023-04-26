import { Roles } from "../../auth/ability/ability.factory";
import { IsArray, IsOptional, IsString } from "class-validator";
import { Badge } from "../../badge/schemas/badge.schema";

export class UpdateUserDTO {
    @IsString()
    @IsOptional()
    role: Roles;

    @IsArray()
    @IsOptional()
    badges: Badge[];
}
