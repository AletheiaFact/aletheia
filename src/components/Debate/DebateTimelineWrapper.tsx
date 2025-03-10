import React, { useLayoutEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineDot, TimelineContent, TimelineProps } from "@mui/lab";
import DebateClaimCardWrapper from "./DebateClaimCardWrapper";
import { useAtom } from "jotai";
import { callbackTimerAtom } from "../../machines/callbackTimer/provider";

const DebateTimelineWrapper = ({ speeches, isLive = false }) => {
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
                sx={{
                    padding: "10px",
                    width: "100%",
                    marginRight: "25%",
                }}
            >
                {[...(timelineData || [])].reverse().map((timelineItem) => {
                    const { personality, _id: speechId } = timelineItem;
                    return (
                        personality &&
                        speechId && (
                            <TimelineItem key={speechId} >
                                <TimelineSeparator >
                                    <TimelineDot color="primary" />
                                    <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent>
                                    <DebateClaimCardWrapper personalityId={personality} speech={timelineItem} />
                                </TimelineContent>
                            </TimelineItem>
                        )
                    );
                })}
                {isLive ? (
                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot color="secondary" />
                        </TimelineSeparator>
                        <TimelineContent>{t("debates:liveLabel")}</TimelineContent>
                    </TimelineItem>
                ) : (
                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot color="error" />
                        </TimelineSeparator>
                        <TimelineContent>
                            {t("debates:isEnded")}
                        </TimelineContent>
                    </TimelineItem>
                )}
            </Timeline>
        </>
    );
};

export default DebateTimelineWrapper;
function styled(Timeline: React.ForwardRefExoticComponent<TimelineProps & React.RefAttributes<HTMLUListElement>>) {
    throw new Error("Function not implemented.");
}

