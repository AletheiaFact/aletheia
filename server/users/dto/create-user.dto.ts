import { Prop } from "@nestjs/mongoose";
import { IsEmail, IsNotEmpty, IsString, IsBoolean,IsAlpha } from 'class-validator';

export class UserDto {
    @IsNotEmpty() //Checks if given value is not empty (!== '', !== null, !== undefined)
    @IsString() //Checks if the string is a string.
    @Prop({ required: true })
    name: string;

    @IsNotEmpty()
    @IsEmail() //Checks if the string is an email.
    @Prop({ required: true, unique: true })
    email: string;

    @IsBoolean() //Checks if a value is a boolean
    @Prop({ required: true, default: false })
    firstPasswordChanged: boolean;
}