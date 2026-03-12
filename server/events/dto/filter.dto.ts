import {
    IsOptional,
    IsInt,
    Min,
    IsString
} from "class-validator";
import { Type } from "class-transformer";
import { EventsStatus } from "../../types/enums";

export class FilterEventsDTO {
    @Type(() => Number)
    @IsInt()
    @Min(0)
    page?: number = 0;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    pageSize?: number = 10;

    @IsString()
    order?: "asc" | "desc";

    @IsOptional()
    @IsString()
    status?: EventsStatus;
}
