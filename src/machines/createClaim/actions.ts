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

const persistClaim = assign<CreateClaimContext, PersistClaimEvent>(
    (context, event) => {
        const claimData = {
            ...context.claimData,
            ...event.claimData,
        };
        const { t, router } = event;

        const sendData = {
            ...claimData,
            personality: claimData.personality?._id || null,
        };

        if (claimData.contentModel === ContentModelEnum.Image) {
            claimApi.saveImage(t, sendData).then((claim) => {
                const path = claim?.personality
                    ? `/personality/${claimData.personality.slug}/claim/${claim.slug}`
                    : `/claim/${claim._id}`;
                router.push(path);
            });
        } else if (claimData.contentModel === ContentModelEnum.Speech) {
            claimApi.save(t, sendData).then(({ slug }) => {
                // Redirect to personality profile in case claim slug is not present
                const path = slug
                    ? `/personality/${claimData.personality.slug}/claim/${slug}`
                    : `/personality/${claimData.personality.slug}`;
                router.push(path);
            });
        }

        return { claimData };
    }
);

export { saveClaimContext, startSpeech, startImage, persistClaim };
