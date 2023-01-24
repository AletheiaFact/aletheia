import { atom, PrimitiveAtom } from "jotai";
import { atomWithMachine } from "jotai/xstate";
import { enableImageClaim } from "../../atoms/featureFlags";
import { ContentModelEnum } from "../../types/enums";
import { Personality } from "../../types/Personality";
import { CreateClaimContext, initialContext } from "./context";
import { newCreateClaimMachine } from "./createClaimMachine";
import { CreateClaimStates } from "./types";

const claimPersonalities = atom<Personality[]>([]) as PrimitiveAtom<
    Personality[]
>;

const machineConfig = atom((get) => {
    const imagesEnabled = get(enableImageClaim);
    const value = imagesEnabled
        ? CreateClaimStates.notStarted
        : CreateClaimStates.setupSpeech;

    const personalities = get(claimPersonalities);
    const context: CreateClaimContext = {
        ...initialContext,
        claimData: {
            personalities,
            contentModel: imagesEnabled ? null : ContentModelEnum.Speech,
        },
    };

    return { value, context };
});

const createClaimMachineAtom = atomWithMachine((get) =>
    newCreateClaimMachine(get(machineConfig))
);

export { claimPersonalities, createClaimMachineAtom };
