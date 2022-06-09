import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { User } from '../../users/schemas/user.schema';

// export type ReviewTaskMachineContext = {
//     reviewData: {
//         userId?: User;
//         summary?: string;
//         questions?: string[];
//         report?: string;
//         verification?: string;
//         source?: string[];
//         classification?: string;
//         sentence_hash: string;
//         type: string;
//     }
// }

// export type MachineEvent = {
//     type: string;
//     userId: string;
//     sentence_hash: string;
//     formUi: object;
// }

// export type MachineHistory = {
//     value: string;
//     context: ReviewTaskMachineContext;
//     event: object; // não necessário salvar no banco
//     tags: object; // não necessário salvar no banco
// }

// export type MachineHistoryValue = {
//     current: string;
// }

// export type Machine = {
//     changed: boolean;
//     context: ReviewTaskMachineContext;
//     event: MachineEvent;
//     history: MachineHistory;
//     historyValue: MachineHistoryValue;
//     value: string;
//     _event: object;
// }
export class CreateClaimReviewTaskDTO {
    @IsNotEmpty()
    @IsObject()
    machine: object;

    @IsNotEmpty()
    @IsString()
    sentence_hash: string;
}
