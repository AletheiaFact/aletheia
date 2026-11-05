import React, { useLayoutEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineDot, TimelineContent, timelineItemClasses } from "@mui/lab";
import { IconButton, Tooltip } from "@mui/material";
import { Edit } from "@mui/icons-material";
import DebateClaimCardWrapper from "./DebateClaimCardWrapper";
import { useAtom } from "jotai";
import { callbackTimerAtom } from "../../machines/callbackTimer/provider";
import { currentNameSpace } from "../../atoms/namespace";
import { NameSpaceEnum } from "../../types/Namespace";

const DebateTimelineWrapper = ({
    speeches,
    isLive = false,
    claimId = undefined,
    canEditSpeeches = false,
}) => {
    const [timelineData, setTimelineData] = useState(speeches);
    const [state] = useAtom(callbackTimerAtom);
    const { t } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);

    const speechEditHref = (speechId: string) => {
        const ns =
            nameSpace && nameSpace !== NameSpaceEnum.Main
                ? `&namespace=${encodeURIComponent(nameSpace)}`
                : "";
        return `/admin/claim-edit?claimId=${encodeURIComponent(
            claimId
        )}&speechId=${encodeURIComponent(speechId)}${ns}`;
    };

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
                                    {canEditSpeeches && claimId && (
                                        <Tooltip title={t("admin-editor:actions.editSpeech")}>
                                            <IconButton
                                                size="small"
                                                href={speechEditHref(speechId)}
                                                aria-label={t("admin-editor:actions.editSpeech")}
                                                style={{ float: "right" }}
                                            >
                                                <Edit fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    <DebateClaimCardWrapper personalityId={personality} speech={timelineItem} />
                                </TimelineContent>
                            </TimelineItem>
                        )
                    );
                })}
            </Timeline>
        </>
    );
};

export default DebateTimelineWrapper;
