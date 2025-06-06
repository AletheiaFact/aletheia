import { Grid } from "@mui/material"
import React, { useContext, useEffect, useState } from "react";
import {
    reviewingSelector,
    reviewDataSelector,
    reviewNotStartedSelector,
    crossCheckingSelector,
} from "../../machines/reviewTask/selectors";
import {
    currentUserId,
    currentUserRole,
    isUserLoggedIn,
} from "../../atoms/currentUser";

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
    const reviewData = useSelector(machineService, reviewDataSelector);
    const isReviewing = useSelector(machineService, reviewingSelector);
    const isCrossChecking = useSelector(machineService, crossCheckingSelector);
    const isUnassigned = useSelector(machineService, reviewNotStartedSelector);
    const userIsAssignee = reviewData.usersId.includes(userId);
    const userIsCrossChecker = reviewData.crossCheckerId === userId;
    const [formCollapsed, setFormCollapsed] = useState(
        isUnassigned && !reportModel
    );
    const userIsAdmin = role === Roles.Admin || role === Roles.SuperAdmin;
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const shouldShowForm = () => {
            if (isUnassigned) return true;
            if (userIsAdmin) return true;
            if (userIsAssignee && !isReviewing) return true;
            if (isReviewing && userIsReviewer) return true;
            if (isCrossChecking && userIsCrossChecker) return true;
            return false;
        };

        setShowForm(shouldShowForm());
    }, [
        isUnassigned,
        userIsAdmin,
        userIsAssignee,
        isReviewing,
        userIsReviewer,
        isCrossChecking,
        userIsCrossChecker,
    ]);

    useEffect(() => {
        setFormCollapsed(isUnassigned && !reportModel);
    }, [isUnassigned]);

    return (
        <Grid container
            style={{
                background: colors.lightNeutral,
                padding: "20px 15px",
                justifyContent:"center"
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
                    />
                )}
            </Grid>
        </Grid>
    );
};

export default ClaimReviewForm;
