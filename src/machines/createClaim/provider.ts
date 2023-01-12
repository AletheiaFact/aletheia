import { atom, PrimitiveAtom } from "jotai";
import { atomWithMachine } from "jotai/xstate";
import { enableImageClaim } from "../../atoms/featureFlags";
import { ContentModelEnum } from "../../types/enums";
import { Personality } from "../../types/Personality";
import { CreateClaimContext, initialContext } from "./context";
import { newCreateClaimMachine } from "./createClaimMachine";
import { CreateClaimStates } from "./types";

const claimPersonality = atom<Personality | null>(
    null
) as PrimitiveAtom<Personality | null>;

const machineConfig = atom((get) => {
    const imagesEnabled = get(enableImageClaim);
    const value = imagesEnabled
        ? CreateClaimStates.notStarted
        : CreateClaimStates.setupSpeech;

    const context: CreateClaimContext = {
        ...initialContext,
        claimData: {
            personality: [get(claimPersonality)],
            contentModel: imagesEnabled ? null : ContentModelEnum.Speech,
        },
    };

    return { value, context };
});

const createClaimMachineAtom = atomWithMachine((get) =>
    newCreateClaimMachine(get(machineConfig))
);

export { claimPersonality, createClaimMachineAtom };
