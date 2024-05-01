import { ApiProperty } from "@nestjs/swagger";
import { Roles } from "../../auth/ability/ability.factory";
import { Transform } from "class-transformer";
import { IsArray, IsOptional, IsString } from "class-validator";

export class GetUsersDTO {
    @IsString()
    @IsOptional()
    @ApiProperty()
    searchName?: string;

    @IsArray()
    @IsOptional()
    @ApiProperty()
    filterOutRoles?: Roles[];

    @IsString()
    @IsOptional()
    @ApiProperty()
    nameSpaceSlug?: string;

    @ApiProperty()
    @IsOptional()
    @Transform(({ value }) => {
        return [true, "enabled", "true", 1, "1"].indexOf(value) > -1;
    })
    canAssignUsers?: boolean | string;

    @IsOptional()
    @ApiProperty()
    badges?: any;

    @IsOptional()
    @ApiProperty()
    project?: any;
}
