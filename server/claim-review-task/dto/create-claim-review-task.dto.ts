import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { User } from '../../users/schemas/user.schema';

export type ReviewTaskMachineContext = {
    userId: User;
    sentence_hash: string;
  }
export class CreateClaimReviewTask {
    @IsNotEmpty()
    @IsString()
    state: string

    @IsObject()
    context: ReviewTaskMachineContext
}
