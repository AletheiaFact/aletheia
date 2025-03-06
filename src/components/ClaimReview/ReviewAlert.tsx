import { Grid } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import AletheiaAlert from "../AletheiaAlert";
import { useTranslation } from "next-i18next";
import { useSelector } from "@xstate/react";
import {
    reviewingSelector,
    reviewNotStartedSelector,
    crossCheckingSelector,
    reviewDataSelector,
} from "../../machines/reviewTask/selectors";
import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import { useAtom } from "jotai";
import {
    currentUserId,
    currentUserRole,
    isUserLoggedIn,
} from "../../atoms/currentUser";
import { Roles, TargetModel } from "../../types/enums";

const ReviewAlert = ({ isHidden, isPublished, hideDescription }) => {
    const { t } = useTranslation();
    const [role] = useAtom(currentUserRole);
    const [isLoggedIn] = useAtom(isUserLoggedIn);
    const [userId] = useAtom(currentUserId);

    const { machineService } = useContext(ReviewTaskMachineContext);
    const reviewNotStarted = useSelector(
        machineService,
        reviewNotStartedSelector
    );
    const reviewData = useSelector(machineService, reviewDataSelector);
    const userIsAdmin = role === Roles.Admin || role === Roles.SuperAdmin;
    const isCrossChecking = useSelector(machineService, crossCheckingSelector);
    const isReviewing = useSelector(machineService, reviewingSelector);
    const userIsReviewer = reviewData.reviewerId === userId;
    const userIsAssignee = reviewData.usersId.includes(userId);
    const userHasPermission = userIsReviewer || userIsAssignee;
    const [hide, setHide] = useState(isHidden);

    useEffect(() => {
        setHide(isHidden);
    }, [isHidden]);

    const alertTypes = {
        hiddenReport: {
            show: true,
            description: hideDescription?.[TargetModel.ClaimReview],
            title: "claimReview:warningAlertTitle",
        },
        crossChecking: {
            show: true,
            description: "",
            title: "reviewTask:crossCheckingAlertTitle",
        },
        reviewing: {
            show: true,
            description: "",
            title: "reviewTask:reviewingAlertTitle",
        },
        hasStarted: {
            show: true,
            description: "",
            title: "reviewTask:hasStartedAlertTitle",
        },
        noAlert: {
            show: false,
            description: "",
            title: "",
        },
    };

    const [alert, setAlert] = useState(alertTypes.noAlert);
    const getAlert = () => {
        if (!isLoggedIn) {
            return alertTypes.noAlert;
        }
        if (hide && !userIsAdmin) {
            return alertTypes.hiddenReport;
        }
        if (!isPublished) {
            if (isCrossChecking && (!userIsAdmin || !userHasPermission)) {
                return alertTypes.crossChecking;
            }
            if (isReviewing && (!userIsAdmin || !userHasPermission)) {
                return alertTypes.reviewing;
            }
            if (!userHasPermission && !userIsAdmin && !reviewNotStarted) {
                return alertTypes.hasStarted;
            }
        }
        return alertTypes.noAlert;
    };

    useEffect(() => {
        const newAlert = getAlert();
        setAlert(newAlert);
    }, [
        isCrossChecking,
        isReviewing,
        hide,
        isLoggedIn,
        userHasPermission,
        userIsAdmin,
    ]);

    return (
        <>
            {alert.show && (
                <Grid
                    style={{
                        margin: isPublished ? "16px 0" : "16px",
                        width: "100%",
                    }}
                    order={3}
                >
                    <AletheiaAlert
                        type="warning"
                        message={t(alert.title)}
                        description={alert.description}
                        showIcon={true}
                    />
                </Grid>
            )}
        </>
    );
};

export default ReviewAlert;
