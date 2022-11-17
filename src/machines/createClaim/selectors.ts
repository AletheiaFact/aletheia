import { ContentModelEnum } from "../../types/enums";
import { CreateClaimStates } from "./types";

const notStartedSelector = (state) => {
    return state.matches(CreateClaimStates.notStarted);
};
const setupSpeechSelector = (state) => {
    return state.matches(CreateClaimStates.setupSpeech);
};
const setupImageSelector = (state) => {
    return state.matches(CreateClaimStates.setupImage);
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

export {
    notStartedSelector,
    setupSpeechSelector,
    setupImageSelector,
    addImageSelector,
    addSpeechSelector,
};
