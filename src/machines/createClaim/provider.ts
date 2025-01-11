import { atom, PrimitiveAtom } from "jotai";
import { atomWithMachine } from "jotai-xstate";
import { Personality } from "../../types/Personality";
import { CreateClaimContext, initialContext } from "./context";
import { newCreateClaimMachine } from "./createClaimMachine";
import { CreateClaimStates } from "./types";
import { currentNameSpace } from "../../atoms/namespace";

const claimPersonalities = atom<Personality[]>([]) as PrimitiveAtom<
    Personality[]
>;

const claimVerificationRequestsGroup = atom<any>(null) as PrimitiveAtom<any>; // type

const machineConfig = atom((get) => {
    const value = CreateClaimStates.notStarted;
    const personalities = get(claimPersonalities);
    const group = get(claimVerificationRequestsGroup);
    const nameSpace = get(currentNameSpace);
    const context: CreateClaimContext = {
        ...initialContext,
        claimData: {
            personalities,
            group,
            contentModel: null,
            nameSpace,
        },
    };

    return { value, context };
});

const createClaimMachineAtom = atomWithMachine((get) =>
    newCreateClaimMachine(get(machineConfig))
);

export {
    claimPersonalities,
    createClaimMachineAtom,
    claimVerificationRequestsGroup as claimVerificationRequests,
};
