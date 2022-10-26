import React, { useContext, useLayoutEffect, useState } from "react";
import { GlobalStateContext } from "../Editor/CallbackTimerProvider";
import { useActor } from "@xstate/react";
import { useTranslation } from "next-i18next";
import { Timeline } from "antd";
import { EditorClaimCardNodeType } from "../Editor/EditorClaimCard/EditorClaimCardExtension";
import ClaimCollectionClaimCardWrapper from "./ClaimCollectionClaimCardWrapper";

const ClaimCollectionTimelineWrapper = ({ collections, isLive = false }) => {
    const [timelineData, setTimelineData] = useState(collections);
    const { timerService } = useContext<any>(GlobalStateContext);
    const [state]: any = useActor<any>(timerService);
    const { t } = useTranslation();

    useLayoutEffect(() => {
        const claimCollection = state?.context?.callbackResult;
        if (claimCollection?.collections) {
            setTimelineData(claimCollection?.collections);
        }
    }, [state?.context?.callbackResult]);

    return (
        <>
            <Timeline
                style={{
                    padding: "10px",
                    width: "100%",
                }}
                pending={isLive && t("debates:liveLabel")}
                reverse={true}
            >
                {Array.isArray(timelineData) &&
                    timelineData.map((timelineItem) => {
                        if (timelineItem.type === EditorClaimCardNodeType) {
                            const { personalityId, claimId, cardId } =
                                timelineItem.attrs;
                            return (
                                personalityId &&
                                claimId && (
                                    <Timeline.Item key={cardId}>
                                        <ClaimCollectionClaimCardWrapper
                                            personalityId={personalityId}
                                            claimId={claimId}
                                        />
                                    </Timeline.Item>
                                )
                            );
                        }
                    })}
                {!isLive && (
                    <Timeline.Item color="red">
                        {t("debates:isEnded")}
                    </Timeline.Item>
                )}
            </Timeline>
        </>
    );
};

export default ClaimCollectionTimelineWrapper;
