import React, { useContext, useEffect, useState } from "react";
import { GlobalStateContext } from "../Editor/CallbackTimerProvider";
import { useActor } from "@xstate/react";
import { useTranslation } from "next-i18next";
import { Timeline } from "antd";
import { EditorClaimCardNodeType } from "../Editor/EditorClaimCard/EditorClaimCardExtension";
import ClaimReviewDrawer from "../ClaimReview/ClaimReviewDrawer";
import ClaimCollectionClaimCardWrapper from "./ClaimCollectionClaimCardWrapper";

const ClaimCollectionTimelineWrapper = ({ collections, userId }) => {
    const [timelineData, setTimelineData] = useState(collections);
    const { timerService } = useContext<any>(GlobalStateContext);
    const [state]: any = useActor<any>(timerService);
    const { t } = useTranslation();

    useEffect(() => {
        const claimCollection = state?.context?.callbackResult;
        if (claimCollection?.editorContentObject?.content) {
            setTimelineData(claimCollection?.editorContentObject?.content);
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
                    timelineData.reverse().map((timelineItem) => {
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
            <ClaimReviewDrawer userId={userId} />
        </>
    );
};

export default ClaimCollectionTimelineWrapper;
