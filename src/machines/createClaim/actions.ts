import { assign } from "xstate";
import { PersistClaimEvent, SaveContextEvent } from "./events";
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
        };

        const saveFunctions = {
            [ContentModelEnum.Speech]: claimApi.saveSpeech,
            [ContentModelEnum.Image]: claimApi.saveImage,
            [ContentModelEnum.Debate]: claimApi.saveDebate,
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

export { saveClaimContext, startSpeech, startImage, startDebate, persistClaim };
