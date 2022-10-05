import { Claim } from "../../types/Claim";

export type CreateClaimContext = {
    claimData: Partial<Claim>;
};

export const initialContext: CreateClaimContext = {
    claimData: {
        title: "",
        date: new Date().toLocaleDateString(),
        sources: [],
    },
};
