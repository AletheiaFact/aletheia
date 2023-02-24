import { IsDateString, IsNotEmpty, IsObject, IsString } from "class-validator";

export class CreateBadgeDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsObject()
    @IsNotEmpty()
    image: Object;

    @IsDateString()
    @IsNotEmpty()
    created_at: string;
}
