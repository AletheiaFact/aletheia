import { IsNotEmpty, IsObject, IsString } from "class-validator";

export class UpdateBadgeDTO {
    @IsString()
    @IsNotEmpty()
    _id: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsObject()
    @IsNotEmpty()
    image: any;
}
