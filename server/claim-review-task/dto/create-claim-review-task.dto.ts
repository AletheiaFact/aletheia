import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { User } from '../../users/schemas/user.schema';

export type ReviewTaskMachineContext = {
    reviewData: {
        userId?: User;
        summary?: string;
        questions?: string[];
        report?: string;
        verification?: string;
        source?: string[];
        classification?: string;
    }
}

export type MachineEvent = {
    type: string;
    userId: string;
    sentence_hash: string;
}

export type MachineHistory = {
    value: string;
    context: ReviewTaskMachineContext;
}

export type MachineHistoryValue = {
    current: string;
}

export type Machine = {
    changed: boolean;
    context: ReviewTaskMachineContext;
    event: MachineEvent;
    history: MachineHistory;
    historyValue: MachineHistoryValue;
    value: string;
}
export class CreateClaimReviewTaskDTO {
    @IsNotEmpty()
    @IsObject()
    machine: Machine;

    @IsNotEmpty()
    @IsString()
    sentence_hash: string;
}
