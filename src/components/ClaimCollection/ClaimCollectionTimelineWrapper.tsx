import React, { useLayoutEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { Timeline } from "antd";
import { EditorClaimCardNodeType } from "../Editor/EditorClaimCard/EditorClaimCardExtension";
import ClaimCollectionClaimCardWrapper from "./ClaimCollectionClaimCardWrapper";

import { useAtom } from "jotai";
import { callbackTimerAtom } from "../../machines/callbackTimer/provider";
const ClaimCollectionTimelineWrapper = ({ collections, isLive = false }) => {
    const [timelineData, setTimelineData] = useState(collections);
    const [state] = useAtom(callbackTimerAtom);

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
