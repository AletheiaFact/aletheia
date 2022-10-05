import { Claim } from "../../types/Claim";

export type SaveContextEvent = {
    type: string;
    claimData: Partial<Claim>;
};

export type CreateClaimMachineEvents = SaveContextEvent;
