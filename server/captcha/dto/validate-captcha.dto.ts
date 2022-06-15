import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateCaptchaDto {
    @IsNotEmpty()
    @IsString()
    recaptcha: string;
}
