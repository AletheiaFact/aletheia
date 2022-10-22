import { Timeline } from "antd";
import { EditorClaimCardNodeType } from "../Editor/EditorClaimCard/EditorClaimCardExtension";
import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import personalityApi from "../../api/personality";
import claimApi from "../../api/claim";
import { useTranslation } from "next-i18next";
import ClaimCard from "../Claim/ClaimCard";
import ClaimSkeleton from "../Skeleton/ClaimSkeleton";
import claimCollectionApi from "../../api/claimCollection";
import {
    CallbackTimerProvider,
    GlobalStateContext,
} from "../Editor/CallbackTimerProvider";
import { useActor } from "@xstate/react";

const ClaimCardWrapper = ({ personalityId, claimId }) => {
    const [personality, setPersonality] = useState();
    const [claim, setClaim] = useState();
    const { t } = useTranslation();
    useEffect(() => {
        if (personalityId) {
            personalityApi
                .getPersonality(personalityId, { language: "pt" }, t)
                .then(setPersonality);
        }
        if (claimId) {
            claimApi.getById(claimId, t).then(setClaim);
        }
    }, [personalityId, claimId]);

    return claim && personality ? (
        <ClaimCard personality={personality} claim={claim} collapsed={false} />
    ) : (
        <ClaimSkeleton />
    );
};

const TimelineWrapper = ({ collections }) => {
    const [timelineData, setTimelineData] = useState(collections);
    const { timerService } = useContext<any>(GlobalStateContext);
    const [state]: any = useActor<any>(timerService);
    const { t } = useTranslation();

    useEffect(() => {
        const claimCollection = state?.context?.callbackResult;
        if (claimCollection?.editorContentObject?.content) {
            console.log(state?.context?.callbackResult);
            setTimelineData(claimCollection?.editorContentObject?.content);
        }
    }, [state?.context?.callbackResult]);
    return (
        <Timeline
            style={{
                padding: "10px",
            }}
            pending={t("debates:liveLabel")}
            reverse={true}
        >
            {Array.isArray(timelineData) &&
                timelineData.reverse().map((timelineItem) => {
                    if (timelineItem.type === EditorClaimCardNodeType) {
                        const { personalityId, claimId, cardId } =
                            timelineItem.attrs;
                        return (
                            personalityId &&
                            claimId && (
                                <Timeline.Item key={cardId}>
                                    <ClaimCardWrapper
                                        personalityId={personalityId}
                                        claimId={claimId}
                                    />
                                </Timeline.Item>
                            )
                        );
                    }
                })}
        </Timeline>
    );
};

const ClaimCollectionView = ({ collections, claimCollectionId }) => {
    const { t } = useTranslation();
    const autoSaveCallback = useCallback(() => {
        return claimCollectionApi.getById(claimCollectionId, t);
    }, [claimCollectionId]);

    return (
        <CallbackTimerProvider callback={autoSaveCallback}>
            <TimelineWrapper collections={collections} />
        </CallbackTimerProvider>
    );
};

export default ClaimCollectionView;
