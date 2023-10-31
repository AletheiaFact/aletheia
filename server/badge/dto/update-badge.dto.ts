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
    @IsNotEmpty()
    @ApiProperty()
    _id: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    description: string;

    @IsObject()
    @IsNotEmpty()
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
