import { IsAlphanumeric, IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { User } from '../../users/schemas/user.schema';

export class CreateClaimReviewTask {
    @IsNotEmpty()
    @IsString()
    userId: User;

    @IsString()
    sentence_hash: string;
}