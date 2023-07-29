import { IsBoolean, IsString } from "class-validator";
import { Personality } from "../../personality/schemas/personality.schema";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateDebateDto {
    @IsString()
    @ApiProperty()
    content: string;

    @IsString()
    @ApiProperty()
    personality: Personality;

    @IsBoolean()
    @ApiProperty()
    isLive: boolean;
}
