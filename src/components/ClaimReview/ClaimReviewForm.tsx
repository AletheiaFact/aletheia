import { Grid } from "@mui/material";
import React, { useContext, useEffect, useState, useMemo } from "react";
import {
    reviewingSelector,
    reviewDataSelector,
    reviewNotStartedSelector,
    crossCheckingSelector,
    addCommentCrossCheckingSelector,
} from "../../machines/reviewTask/selectors";
import { useReviewTaskPermissions } from "../../machines/reviewTask/usePermissions";
import {
    currentUserId,
    currentUserRole,
    isUserLoggedIn,
} from "../../atoms/currentUser";
import { VisualEditorContext } from "../Collaborative/VisualEditorProvider";
import FactCheckingInfo from "../SentenceReport/FactCheckingInfo";

import DynamicReviewTaskForm from "./form/DynamicReviewTaskForm";
import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import { Roles } from "../../types/enums";
import colors from "../../styles/colors";
import { useAtom } from "jotai";
import { useSelector } from "@xstate/react";
import ReportModelButtons from "./ReportModelButtons";
import LoginButton from "../LoginButton";

const ClaimReviewForm = ({
    dataHash,
    userIsReviewer,
    componentStyle,
    target,
    personalityId = null,
}) => {
    const [isLoggedIn] = useAtom(isUserLoggedIn);
    const [role] = useAtom(currentUserRole);
    const [userId] = useAtom(currentUserId);
    const { machineService, reportModel } = useContext(
        ReviewTaskMachineContext
    );
    const { canShowEditor } = useContext(VisualEditorContext);
    const reviewData = useSelector(machineService, reviewDataSelector);
    const isReviewing = useSelector(machineService, reviewingSelector);
    const isCrossChecking = useSelector(machineService, crossCheckingSelector);
    const isAddCommentCrossChecking = useSelector(
        machineService,
        addCommentCrossCheckingSelector
    );
    const isUnassigned = useSelector(machineService, reviewNotStartedSelector);
    const [formCollapsed, setFormCollapsed] = useState(
        isUnassigned && !reportModel
    );
    
    // Use centralized permission system
    const permissions = useReviewTaskPermissions();
    const showForm = permissions.showForm;
    const canInteractWithForm = permissions.canSubmitActions.length > 0;

    useEffect(() => {
        setFormCollapsed(isUnassigned && !reportModel);
    }, [isUnassigned]);

    // If user can't see editor and it's not unassigned state, show info banner
    // For unassigned state, we want to show the assignment form instead
    if (canShowEditor === false && !isUnassigned) {
        return (
            <Grid
                container
                style={{
                    background: colors.lightNeutral,
                    padding: "20px 15px",
                    justifyContent: "center",
                }}
            >
                <Grid item xs={componentStyle.span}>
                    <FactCheckingInfo />
                </Grid>
            </Grid>
        );
    }

    return (
        <Grid
            container
            style={{
                background: colors.lightNeutral,
                padding: "20px 15px",
                justifyContent: "center",
            }}
        >
            <Grid item xs={componentStyle.span}>
                {formCollapsed && (
                    <ReportModelButtons setFormCollapsed={setFormCollapsed} />
                )}
                {!isLoggedIn && <LoginButton />}
                {!formCollapsed && showForm && (
                    <DynamicReviewTaskForm
                        data_hash={dataHash}
                        personality={personalityId}
                        target={target?._id}
                        canInteract={canInteractWithForm}
                    />
                )}
            </Grid>
        </Grid>
    );
};

export default ClaimReviewForm;
