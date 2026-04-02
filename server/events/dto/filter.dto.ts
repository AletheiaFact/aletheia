import {
    IsOptional,
    IsInt,
    Min,
    IsString,
    IsEnum,
    IsIn
} from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { EventsStatus } from "../../types/enums";

export class FilterEventsDTO {
    @ApiPropertyOptional({ default: 0 })
    @Type(() => Number)
    @IsInt()
    @Min(0)
    @IsOptional()
    page?: number = 0;

    @ApiPropertyOptional({ default: 10 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    pageSize?: number = 10;

    @ApiPropertyOptional({ enum: ["asc", "desc"], default: "asc" })
    @IsString()
    @IsOptional()
    @IsIn(["asc", "desc"])
    order?: "asc" | "desc" = "asc";

    @ApiPropertyOptional({ enum: EventsStatus })
    @IsOptional()
    @IsEnum(EventsStatus)
    status?: EventsStatus;
}
