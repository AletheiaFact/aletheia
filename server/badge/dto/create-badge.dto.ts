import { ApiProperty } from "@nestjs/swagger";
import {
    IsArray,
    IsDateString,
    IsNotEmpty,
    IsObject,
    IsOptional,
    IsString,
} from "class-validator";

export class CreateBadgeDTO {
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

    @IsDateString()
    @IsNotEmpty()
    @ApiProperty()
    created_at: string;

    @IsArray()
    @IsOptional()
    @ApiProperty()
    users: { badges: any[]; name: string; _id: string }[];
}
