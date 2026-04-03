import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateClaimReviewDTO {
    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty()
    isHidden: boolean;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    recaptcha?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    description?: string;
}
