import { IsBoolean, IsString } from "class-validator";
import { Personality } from "../../personality/schemas/personality.schema";

export class UpdateDebateDto {
    @IsString()
    content: string;

    @IsString()
    personality: Personality;

    @IsBoolean()
    isLive: boolean;
}
