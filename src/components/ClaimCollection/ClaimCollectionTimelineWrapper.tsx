import React, { useContext, useEffect, useState } from "react";
import { GlobalStateContext } from "../Editor/CallbackTimerProvider";
import { useActor } from "@xstate/react";
import { useTranslation } from "next-i18next";
import { Timeline } from "antd";
import { EditorClaimCardNodeType } from "../Editor/EditorClaimCard/EditorClaimCardExtension";
import ClaimCollectionClaimCardWrapper from "./ClaimCollectionClaimCardWrapper";

const ClaimCollectionTimelineWrapper = ({ collections }) => {
    const [timelineData, setTimelineData] = useState(collections.reverse());
    const { timerService } = useContext<any>(GlobalStateContext);
    const [state]: any = useActor<any>(timerService);
    const { t } = useTranslation();

    useEffect(() => {
        const claimCollection = state?.context?.callbackResult;
        if (claimCollection?.editorContentObject?.content) {
            setTimelineData(
                claimCollection?.editorContentObject?.content.reverse()
            );
        }
    }, [state?.context?.callbackResult]);
    return (
        <>
            <Timeline
                style={{
                    padding: "10px",
                }}
                pending={t("debates:liveLabel")}
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
            </Timeline>
        </>
    );
};

export default ClaimCollectionTimelineWrapper;
