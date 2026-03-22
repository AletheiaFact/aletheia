import { Grid } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import AletheiaAlert from "../AletheiaAlert";
import { useTranslation } from "next-i18next";
import { useSelector } from "@xstate/react";
import {
    reviewingSelector,
    reviewNotStartedSelector,
    crossCheckingSelector,
    addCommentCrossCheckingSelector,
} from "../../machines/reviewTask/selectors";
import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import { useAtom } from "jotai";
import {
    currentUserRole,
    isUserLoggedIn,
    isAuthResolved,
} from "../../atoms/currentUser";
import { TargetModel } from "../../types/enums";
import { isAdmin } from "../../utils/GetUserPermission";

const ReviewAlert = ({ isHidden, isPublished, hideDescription }) => {
    const { t } = useTranslation();
    const [role] = useAtom(currentUserRole);
    const [isLoggedIn] = useAtom(isUserLoggedIn);
    const [authResolved] = useAtom(isAuthResolved);

    const { machineService } = useContext(ReviewTaskMachineContext);
    const reviewNotStarted = useSelector(
        machineService,
        reviewNotStartedSelector
    );
    const userIsAdmin = isAdmin(role);
    const isCrossChecking = useSelector(machineService, crossCheckingSelector);
    const isAddCommentCrossChecking = useSelector(
        machineService,
        addCommentCrossCheckingSelector
    );
    const isReviewing = useSelector(machineService, reviewingSelector);
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
        // Don't show alerts until auth state is resolved to prevent flash
        if (!authResolved) {
            return alertTypes.noAlert;
        }

        // Show status messages only to non-logged-in users
        if (isLoggedIn) {
            // Only show hidden report warning to logged-in non-admins
            if (hide && !userIsAdmin) {
                return alertTypes.hiddenReport;
            }
            return alertTypes.noAlert;
        }

        // Non-logged-in users see workflow status alerts
        if (!isPublished && !reviewNotStarted) {
            if (isCrossChecking || isAddCommentCrossChecking) {
                return alertTypes.crossChecking;
            }
            if (isReviewing) {
                return alertTypes.reviewing;
            }
            return alertTypes.hasStarted;
        }
        return alertTypes.noAlert;
    };

    useEffect(() => {
        const newAlert = getAlert();
        setAlert(newAlert);
    }, [
        authResolved,
        isCrossChecking,
        isReviewing,
        hide,
        isLoggedIn,
        isPublished,
        reviewNotStarted,
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
