import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDate, IsOptional, IsString } from "class-validator";

export class CreateVerificationRequestDTO {
    @IsString()
    @ApiProperty()
    content: string;

    @IsDate()
    @ApiProperty()
    @IsOptional()
    date: Date;

    @IsArray()
    @ApiProperty()
    @IsOptional()
    sources: string[];

    @IsString()
    @IsOptional()
    @ApiProperty()
    data_hash: string;

    @IsOptional()
    @IsArray()
    @ApiProperty()
    embedding?: number[];
}
