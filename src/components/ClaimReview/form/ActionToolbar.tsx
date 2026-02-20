import React from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "next-i18next";
import AletheiaButton, { ButtonType } from "../../Button";
import {
    ReviewTaskEvents,
    ReviewTaskStates,
} from "../../../machines/reviewTask/enums";
import { PermissionContext } from "../../../machines/reviewTask/permissions";

export const CAPTCHA_EXEMPT_EVENTS = [
    ReviewTaskEvents.draft,
    ReviewTaskEvents.goback,
    ReviewTaskEvents.viewPreview,
];

const PRIMARY_ACTIONS: Partial<Record<ReviewTaskStates, ReviewTaskEvents>> = {
    [ReviewTaskStates.unassigned]: ReviewTaskEvents.assignUser,
    [ReviewTaskStates.assigned]: ReviewTaskEvents.finishReport,
    [ReviewTaskStates.reported]: ReviewTaskEvents.finishReport,
    [ReviewTaskStates.selectReviewer]: ReviewTaskEvents.sendToReview,
    [ReviewTaskStates.selectCrossChecker]: ReviewTaskEvents.sendToCrossChecking,
    [ReviewTaskStates.crossChecking]: ReviewTaskEvents.submitCrossChecking,
    [ReviewTaskStates.addCommentCrossChecking]: ReviewTaskEvents.submitComment,
    [ReviewTaskStates.submitted]: ReviewTaskEvents.publish,
    [ReviewTaskStates.rejected]: ReviewTaskEvents.addRejectionComment,
};

function getButtonType(
    event: ReviewTaskEvents,
    currentState: string
): ButtonType {
    if (event === ReviewTaskEvents.goback) return ButtonType.gray;
    const primaryEvent = PRIMARY_ACTIONS[currentState as ReviewTaskStates];
    if (primaryEvent && event === primaryEvent) return ButtonType.blue;
    return ButtonType.whiteBlue;
}

interface ActionToolbarProps {
    events: ReviewTaskEvents[];
    permissions: PermissionContext;
    isLoading: Record<string, boolean>;
    currentState: string;
    onButtonClick: (event: ReviewTaskEvents) => void;
    defineButtonHtmlType: (event: ReviewTaskEvents) => "button" | "submit";
}

const ActionToolbar = ({
    events,
    permissions,
    isLoading,
    currentState,
    onButtonClick,
    defineButtonHtmlType,
}: ActionToolbarProps) => {
    const { t } = useTranslation();

    const filteredEvents = events.filter(
        (event) =>
            event !== ReviewTaskEvents.draft &&
            permissions.canSubmitActions.includes(event)
    );

    return (
        <Grid
            container
            style={{
                padding: "32px 0 0",
                justifyContent: "space-evenly",
                gap: "10px",
            }}
        >
            {permissions.showSaveDraftButton &&
                permissions.canSubmitActions.includes(
                    ReviewTaskEvents.draft
                ) && (
                    <AletheiaButton
                        loading={isLoading[ReviewTaskEvents.draft]}
                        type={ButtonType.whiteBlue}
                        htmlType="button"
                        onClick={() => onButtonClick(ReviewTaskEvents.draft)}
                        event={ReviewTaskEvents.draft}
                        data-cy={`testClaimReview${ReviewTaskEvents.draft}`}
                    >
                        {t(`reviewTask:${ReviewTaskEvents.draft}`)}
                    </AletheiaButton>
                )}

            {filteredEvents.map((event) => (
                <AletheiaButton
                    loading={isLoading[event]}
                    key={event}
                    type={getButtonType(event, currentState)}
                    htmlType={defineButtonHtmlType(event)}
                    onClick={() => onButtonClick(event)}
                    event={event}
                    data-cy={`testClaimReview${event}`}
                >
                    {t(`reviewTask:${event}`)}
                </AletheiaButton>
            ))}
        </Grid>
    );
};

export default ActionToolbar;
