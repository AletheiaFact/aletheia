import React, { useMemo } from "react";
import { Box } from "@mui/material";
import { useTranslation } from "next-i18next";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import AletheiaButton, { ButtonType } from "../../AletheiaButton";
import {
    ReviewTaskEvents,
    ReviewTaskStates,
} from "../../../machines/reviewTask/enums";
import { PermissionContext } from "../../../machines/reviewTask/permissions";

export const CAPTCHA_EXEMPT_EVENTS = [
    ReviewTaskEvents.draft,
    ReviewTaskEvents.viewPreview,
    ReviewTaskEvents.selectedReview,
    ReviewTaskEvents.selectedCrossChecking,
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
    [ReviewTaskStates.rejected]: ReviewTaskEvents.confirmRejection,
};

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

    const primaryEvent = PRIMARY_ACTIONS[currentState as ReviewTaskStates];

    // Separate events into groups for proper layout
    const { goBackEvent, secondaryEvents, primaryActionEvent } = useMemo(() => {
        const allowed = events.filter(
            (event) =>
                event !== ReviewTaskEvents.draft &&
                permissions.canSubmitActions.includes(event)
        );

        const goBack = allowed.find((e) => e === ReviewTaskEvents.goback);
        const primary = allowed.find((e) => e === primaryEvent);
        const secondary = allowed.filter(
            (e) => e !== ReviewTaskEvents.goback && e !== primary
        );

        return {
            goBackEvent: goBack,
            secondaryEvents: secondary,
            primaryActionEvent: primary,
        };
    }, [events, permissions.canSubmitActions, primaryEvent]);

    const showSaveDraft =
        permissions.showSaveDraftButton &&
        permissions.canSubmitActions.includes(ReviewTaskEvents.draft);

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 20px",
                position: "sticky",
                bottom: 0,
                backgroundColor: "inherit",
                borderTop: "1px solid rgba(0, 0, 0, 0.12)",
                zIndex: 10,
                gap: "12px",
            }}
        >
            {/* Left group: navigation actions */}
            <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {goBackEvent && (
                    <AletheiaButton
                        loading={isLoading[goBackEvent]}
                        type={ButtonType.gray}
                        htmlType="button"
                        onClick={() => onButtonClick(goBackEvent)}
                        event={goBackEvent}
                        data-cy={`testClaimReview${goBackEvent}`}
                        startIcon={<ArrowBackIcon style={{ fontSize: 16 }} />}
                        fontWeight={500}
                    >
                        {t(`reviewTask:${goBackEvent}`)}
                    </AletheiaButton>
                )}
            </Box>

            {/* Right group: save + secondary + primary action */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    flexWrap: "wrap",
                    justifyContent: "flex-end",
                }}
            >
                {showSaveDraft && (
                    <AletheiaButton
                        loading={isLoading[ReviewTaskEvents.draft]}
                        type={ButtonType.whiteBlack}
                        htmlType="button"
                        onClick={() => onButtonClick(ReviewTaskEvents.draft)}
                        event={ReviewTaskEvents.draft}
                        data-cy={`testClaimReview${ReviewTaskEvents.draft}`}
                        startIcon={<SaveOutlinedIcon style={{ fontSize: 16 }} />}
                        fontWeight={500}
                    >
                        {t(`reviewTask:${ReviewTaskEvents.draft}`)}
                    </AletheiaButton>
                )}

                {secondaryEvents.map((event) => (
                    <AletheiaButton
                        loading={isLoading[event]}
                        key={event}
                        type={ButtonType.whiteBlack}
                        htmlType={defineButtonHtmlType(event)}
                        onClick={() => onButtonClick(event)}
                        event={event}
                        data-cy={`testClaimReview${event}`}
                        fontWeight={500}
                    >
                        {t(`reviewTask:${event}`)}
                    </AletheiaButton>
                ))}

                {primaryActionEvent && (
                    <AletheiaButton
                        loading={isLoading[primaryActionEvent]}
                        type={ButtonType.primary}
                        htmlType={defineButtonHtmlType(primaryActionEvent)}
                        onClick={() => onButtonClick(primaryActionEvent)}
                        event={primaryActionEvent}
                        data-cy={`testClaimReview${primaryActionEvent}`}
                        fontWeight={600}
                        sx={{ minWidth: 140, height: 44, fontSize: "13px" }}
                    >
                        {t(`reviewTask:${primaryActionEvent}`)}
                    </AletheiaButton>
                )}
            </Box>
        </Box>
    );
};

export default ActionToolbar;
