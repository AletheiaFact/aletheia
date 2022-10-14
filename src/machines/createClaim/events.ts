import { NextRouter } from "next/router";
import { Claim } from "../../types/Claim";

export type SaveContextEvent = {
    type: string;
    claimData: Partial<Claim>;
};

export type PersistClaimEvent = {
    type: string;
    claimData: Partial<Claim>;
    t: any;
    router: NextRouter;
};

export type CreateClaimMachineEvents = SaveContextEvent | PersistClaimEvent;
