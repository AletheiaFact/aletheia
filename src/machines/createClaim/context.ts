import { Claim } from "../../types/Claim";
import { Personality } from "../../types/Personality";

export type CreateClaimContext = {
    claimData: Partial<Claim>;
    // Personalities preselected from the URL, restored when the user goes back to the start
    initialPersonalities: Personality[];
};

export const initialContext: CreateClaimContext = {
    claimData: {
        title: "",
        date: new Date().toLocaleDateString(),
        sources: [],
        group: null,
    },
    initialPersonalities: [],
};
