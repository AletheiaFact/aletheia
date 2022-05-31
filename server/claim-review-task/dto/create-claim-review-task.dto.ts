import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { User } from '../../users/schemas/user.schema';

export type ReviewTaskMachineContext = {
    userId?: User;
    summary?: string;
    questions?: string[];
    report?: string;
    verification?: string;
    source?: string[];
    classification?: string;
  }
export class CreateClaimReviewTaskDTO {
    @IsNotEmpty()
    @IsString()
    state: string

    @IsNotEmpty()
    @IsString()
    sentence_hash: string;

    @IsObject()
    context: ReviewTaskMachineContext
}
