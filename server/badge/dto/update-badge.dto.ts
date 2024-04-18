import { ApiProperty } from "@nestjs/swagger";
import { Roles } from "../../auth/ability/ability.factory";
import {
    IsArray,
    IsNotEmpty,
    IsObject,
    IsOptional,
    IsString,
} from "class-validator";

export class UpdateBadgeDTO {
    @IsString()
    @IsOptional()
    @ApiProperty()
    _id: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    name: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    description: string;

    @IsObject()
    @IsOptional()
    @ApiProperty()
    image: any;

    @IsArray()
    @IsOptional()
    @ApiProperty()
    users: {
        badges: any[];
        name: string;
        _id: string;
        role: object;
    }[];
}
