import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDate, IsEnum, IsOptional, IsString } from "class-validator";
import { ContentModelEnum } from "../../types/enums";

export class CreateVerificationRequestDTO {
    @IsString()
    @ApiProperty()
    content: string;

    
    @IsString()
    @ApiProperty()
    receptionChannel: string;

    @IsEnum(ContentModelEnum)
    @ApiProperty()
    @IsOptional()
    reportType: ContentModelEnum;

    @ApiProperty()
    @IsOptional()
    impactArea: string | { label: string; value: string };

    @IsString()
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
    nameSpace?: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    recaptcha?: string;

    @IsOptional()
    @IsArray()
    @ApiProperty()
    embedding?: number[];
}
