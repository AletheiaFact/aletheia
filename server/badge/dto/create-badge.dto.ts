import {
    IsArray,
    IsDateString,
    IsNotEmpty,
    IsObject,
    IsOptional,
    IsString,
} from "class-validator";

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

    @IsArray()
    @IsOptional()
    users: { badges: any[]; name: string; _id: string }[];
}
