import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateHiddenStatusDTO {
    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty()
    isHidden: boolean;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    recaptcha: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    description?: string;
}
