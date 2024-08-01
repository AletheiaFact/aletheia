import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDate, IsOptional, IsString } from "class-validator";

export class CreateVerificationRequestDTO {
    @IsString()
    @ApiProperty()
    content: string;

    @IsArray()
    @ApiProperty()
    @IsOptional()
    source: string;

    @IsString()
    @ApiProperty()
    @IsOptional()
    publicationDate: string;

    @IsString()
    @ApiProperty()
    @IsOptional()
    email: string;

    @IsDate()
    @ApiProperty()
    @IsOptional()
    date: Date;

    @IsString()
    @ApiProperty()
    @IsOptional()
    heardFrom: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    data_hash: string;
}
