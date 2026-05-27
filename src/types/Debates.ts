import { Personality } from "./Personality";

export interface Debate {
    claimId: string;
    title: string;
    personalities: Personality[];
}
