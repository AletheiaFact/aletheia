import { ContentModelEnum } from "../../types/enums";
import { CreateClaimStates } from "./types";

const stateSelector = (state, key: keyof typeof CreateClaimStates) => {
    return state.matches(CreateClaimStates[key]);
};

const addImageSelector = (state) => {
    return (
        state.matches(CreateClaimStates.personalityAdded) &&
        state.context.claimData.contentModel === ContentModelEnum.Image
    );
};

const addSpeechSelector = (state) => {
    return (
        state.matches(CreateClaimStates.personalityAdded) &&
        state.context.claimData.contentModel === ContentModelEnum.Speech
    );
};

const addDebateSelector = (state) => {
    return (
        state.matches(CreateClaimStates.personalityAdded) &&
        state.context.claimData.contentModel === ContentModelEnum.Debate
    );
};

export {
    addImageSelector,
    addSpeechSelector,
    stateSelector,
    addDebateSelector,
};
