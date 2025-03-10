import React, { useLayoutEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineDot, TimelineContent, timelineItemClasses } from "@mui/lab";
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
                    [`& .${timelineItemClasses.root}:before`]: {
                        flex: 0,
                        padding: 0,
                    },
                    width: "100%",
                    padding: "10px",
                }}
            >
                {[...(timelineData || [])].reverse().map((timelineItem) => {
                    const { personality, _id: speechId } = timelineItem;
                    return (
                        personality &&
                        speechId && (
                            <TimelineItem key={speechId}>
                                <TimelineSeparator>
                                    <TimelineDot variant="outlined" color="primary" />
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
                            <TimelineDot variant="outlined" color="secondary" />
                        </TimelineSeparator>
                        <TimelineContent>{t("debates:liveLabel")}</TimelineContent>
                    </TimelineItem>
                ) : (
                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot variant="outlined" color="error" />
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
