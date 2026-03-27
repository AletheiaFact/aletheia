import {
    IsArray,
    IsDate,
    IsNotEmpty,
    IsObject,
    IsOptional,
    IsString
} from "class-validator";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import type { TopicData } from "../../topic/types/topic.interfaces";
import { IsAfter } from "./is-after.decorator";

export class CreateEventDTO {
    @IsString()
    @IsOptional()
    @ApiProperty()
    nameSpace?: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    badge: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    description: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    location: string;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    @ApiProperty()
    startDate: Date;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    @ApiProperty()
    @IsAfter("startDate")
    endDate: Date;

    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    mainTopic: TopicData;

    @IsString()
    @IsOptional()
    @ApiProperty()
    recaptcha?: string;
}

export class UpdateEventDTO extends PartialType(CreateEventDTO) {
    @IsArray()
    @IsOptional()
    @ApiProperty()
    filterTopics: TopicData[];
}
