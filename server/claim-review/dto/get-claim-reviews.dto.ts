import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator";
export class GetClaimReviewsDTO {
    @IsNumber()
    @IsInt()
    @Min(0)
    @ApiProperty()
    page: number;

    @IsNumber()
    @Min(0)
    @ApiProperty()
    pageSize: number;

    @IsString()
    @ApiProperty()
    order: string;

    @IsOptional()
    @ApiProperty()
    @Transform(({ value }) => {
        return [true, "enabled", "true", 1, "1"].indexOf(value) > -1;
    })
    isHidden: boolean | string;

    @IsOptional()
    @ApiProperty()
    @Transform(({ value }) => {
        return [true, "enabled", "true", 1, "1"].indexOf(value) > -1;
    })
    latest: boolean;
}
