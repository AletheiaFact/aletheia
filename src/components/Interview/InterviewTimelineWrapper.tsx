import React, { useLayoutEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { Timeline } from "antd";
import InterviewClaimCardWrapper from "./InterviewClaimCardWrapper";

import { useAtom } from "jotai";
import { callbackTimerAtom } from "../../machines/callbackTimer/provider";
const InterviewTimelineWrapper = ({ speeches, isLive = false }) => {
    const [timelineData, setTimelineData] = useState(speeches);
    const [state] = useAtom(callbackTimerAtom);
    const { t } = useTranslation();

    useLayoutEffect(() => {
        const claim = state?.context?.callbackResult;
        if (claim?.content?.content) {
            setTimelineData(claim?.content?.content.reverse());
        } else {
            setTimelineData(speeches.reverse());
        }
    }, [state?.context?.callbackResult, speeches]);

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
                        const { personality, _id: speechId } = timelineItem;
                        return (
                            personality &&
                            speechId && (
                                <Timeline.Item key={speechId}>
                                    <InterviewClaimCardWrapper
                                        personalityId={personality}
                                        speech={timelineItem}
                                    />
                                </Timeline.Item>
                            )
                        );
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

export default InterviewTimelineWrapper;
