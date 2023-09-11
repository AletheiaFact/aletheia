import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
    IsAlpha,
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    Min,
} from "class-validator";
export class GetClaimsDTO {
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

    @IsString()
    @IsAlpha()
    @ApiProperty()
    language: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    personality: string;

    @IsOptional()
    @ApiProperty()
    @Transform(({ value }) => {
        return [true, "enabled", "true", 1, "1"].indexOf(value) > -1;
    })
    isHidden: boolean | string;
}
