import { IsObject, IsString } from "class-validator";

export class CreateAutomatedFactCheckingDTO {
    @IsString()
    claim: string;

    @IsObject()
    context: object;
}
