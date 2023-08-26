import { ApiProperty } from "@nestjs/swagger";
import {
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
    MinLength,
} from "class-validator";
export class CreatePersonalityDTO {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @ApiProperty()
    name: string;

    @IsString()
    @ApiProperty()
    description: string;

    @IsString()
    @ApiProperty()
    wikidata: string;

    @IsBoolean()
    @IsOptional()
    @ApiProperty()
    isAllowedProp?: boolean;

    @IsString()
    @IsOptional()
    @ApiProperty()
    image?: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    avatar?: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    wikipedia?: string;
}
