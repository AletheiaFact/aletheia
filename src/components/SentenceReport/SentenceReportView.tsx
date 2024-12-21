import { useSelector } from "@xstate/react";
import { Grid } from "@mui/material";
import React, { useContext } from "react";

import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import { Roles } from "../../types/enums";
import {
    reviewingSelector,
    publishedSelector,
    crossCheckingSelector,
    reportSelector,
} from "../../machines/reviewTask/selectors";
import colors from "../../styles/colors";
import CTARegistration from "../Home/CTARegistration";
import SentenceReportContent from "./SentenceReportContent";
import { useAtom } from "jotai";
import {
    currentUserId,
    currentUserRole,
    isUserLoggedIn,
} from "../../atoms/currentUser";
import SentenceReportComments from "./SentenceReportComments";
import { ReviewTaskTypeEnum } from "../../../server/types/enums";

const SentenceReportView = ({
    context,
    userIsNotRegular,
    userIsReviewer,
    isHidden,
    href,
    componentStyle,
}) => {
    const [isLoggedIn] = useAtom(isUserLoggedIn);
    const [role] = useAtom(currentUserRole);
    const [userId] = useAtom(currentUserId);
    const { machineService, publishedReview, reviewTaskType } = useContext(
        ReviewTaskMachineContext
    );
    const userIsCrossChecker = context.crossCheckerId === userId;
    const userIsAssignee = context.usersId.includes(userId);
    const isReport = useSelector(machineService, reportSelector);
    const isCrossChecking = useSelector(machineService, crossCheckingSelector);
    const isReviewing = useSelector(machineService, reviewingSelector);
    const isPublished =
        useSelector(machineService, publishedSelector) ||
        publishedReview?.review;
    const userIsAdmin = role === Roles.Admin || role === Roles.SuperAdmin;

    const canShowClassificationAndCrossChecking =
        (isCrossChecking && (userIsAdmin || userIsCrossChecker)) ||
        (isReviewing && (userIsAdmin || userIsReviewer)) ||
        (isReport && (userIsAdmin || userIsAssignee || userIsCrossChecker));

    const canShowReport =
        (isPublished && (!isHidden || userIsNotRegular)) ||
        canShowClassificationAndCrossChecking;

    return (
        canShowReport &&
        reviewTaskType !== ReviewTaskTypeEnum.VerificationRequest && (
            <Grid container
                justifyContent="center"
                style={
                    (isCrossChecking || isReport || isReviewing) && {
                        backgroundColor: colors.lightNeutral,
                    }
                }
            >
                <Grid item xs={componentStyle.span}>
                    {canShowClassificationAndCrossChecking && (
                        <SentenceReportComments context={context} />
                    )}
                    <SentenceReportContent
                        context={context?.reviewDataHtml || context}
                        classification={context.classification}
                        showClassification={
                            canShowClassificationAndCrossChecking
                        }
                        href={href}
                    />
                    {!isLoggedIn && <CTARegistration />}
                </Grid>
            </Grid>
        )
    );
};

export default SentenceReportView;
