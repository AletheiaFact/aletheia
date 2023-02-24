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
    image: any;

    @IsDateString()
    @IsNotEmpty()
    created_at: string;
}
