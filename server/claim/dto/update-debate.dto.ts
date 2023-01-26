import { IsNotEmpty, IsString } from "class-validator";
import { Personality } from "../../personality/schemas/personality.schema";

export class UpdateDebateDto {
    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsString()
    personality: Personality;
}
