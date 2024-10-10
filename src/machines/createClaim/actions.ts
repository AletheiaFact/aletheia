import { assign } from "xstate";
import {
    PersistClaimEvent,
    RemovePersonalityEvent,
    SaveContextEvent,
} from "./events";
import { CreateClaimContext } from "./context";
import { ContentModelEnum } from "../../types/enums";
import claimApi from "../../api/claim";

const saveClaimContext = assign<CreateClaimContext, SaveContextEvent>(
    (context, event) => {
        return {
            claimData: {
                ...context.claimData,
                ...event.claimData,
            },
        };
    }
);

const startSpeech = assign<CreateClaimContext>((context) => {
    return {
        claimData: {
            ...context.claimData,
            contentModel: ContentModelEnum.Speech,
        },
    };
});

const startImage = assign<CreateClaimContext>((context) => {
    return {
        claimData: {
            ...context.claimData,
            contentModel: ContentModelEnum.Image,
        },
    };
});

const startDebate = assign<CreateClaimContext>((context) => {
    return {
        claimData: {
            ...context.claimData,
            contentModel: ContentModelEnum.Debate,
        },
    };
});

const startInterview = assign<CreateClaimContext>((context) => {
    return {
        claimData: {
            ...context.claimData,
            contentModel: ContentModelEnum.Interview,
        },
    };
});

const startUnattributed = assign<CreateClaimContext>((context) => {
    return {
        claimData: {
            ...context.claimData,
            contentModel: ContentModelEnum.Unattributed,
            personalities: [],
        },
    };
});

const removePersonality = assign<CreateClaimContext, RemovePersonalityEvent>(
    (contex, event) => {
        const { personality } = event;
        const { personalities } = contex.claimData;

        return {
            claimData: {
                ...contex.claimData,
                personalities: personalities.filter(
                    (p) => p._id !== personality._id
                ),
            },
        };
    }
);

const persistClaim = assign<CreateClaimContext, PersistClaimEvent>(
    (context, event) => {
        const claimData = {
            ...context.claimData,
            ...event.claimData,
        };
        const { t, router } = event;
        const sendData = {
            ...claimData,
            personalities: claimData.personalities.map((p) => p._id),
            group: claimData.group._id,
        };

        const saveFunctions = {
            [ContentModelEnum.Speech]: claimApi.saveSpeech,
            [ContentModelEnum.Image]: claimApi.saveImage,
            [ContentModelEnum.Debate]: claimApi.saveDebate,
            [ContentModelEnum.Interview]: claimApi.saveInterview,
            [ContentModelEnum.Unattributed]: claimApi.saveUnattributed,
        };

        saveFunctions[claimData.contentModel](t, sendData)
            .then((claim) => {
                router.push(claim.path);
            })
            .catch((err) => {
                console.error("error saving the claim", err);
            });

        return { claimData };
    }
);

export {
    saveClaimContext,
    startSpeech,
    startImage,
    startDebate,
    startInterview,
    startUnattributed,
    removePersonality,
    persistClaim,
};
