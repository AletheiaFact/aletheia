import { IsDateString, IsNotEmpty, IsString } from "class-validator";

export class CreateBadgeDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    image: string;

    @IsDateString()
    @IsNotEmpty()
    created_at: string;
}
