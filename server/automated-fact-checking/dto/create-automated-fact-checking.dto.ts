import { IsString } from "class-validator";

export class CreateAutomatedFactCheckingDTO {
    @IsString()
    sentence: string;
}
