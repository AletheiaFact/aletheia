import { useSelector } from "@xstate/react";
import { Col, Row } from "antd";
import React, { useContext } from "react";

import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import { Roles } from "../../types/enums";
import {
    reviewingSelector,
    isPartialReviewSelector,
    publishedSelector,
    crossCheckingSelector,
    reportSelector,
} from "../../machines/reviewTask/selectors";
import colors from "../../styles/colors";
import CTARegistration from "../Home/CTARegistration";
import PartialReviewWarning from "../PartialReviewWarning";
import SentenceReportContent from "./SentenceReportContent";
import { useAtom } from "jotai";
import { currentUserRole, isUserLoggedIn } from "../../atoms/currentUser";

const SentenceReportView = ({
    context,
    userIsNotRegular,
    userIsReviewer,
    isHidden,
    userIsAssignee,
    userIsCrossChecker,
}) => {
    const [isLoggedIn] = useAtom(isUserLoggedIn);
    const [role] = useAtom(currentUserRole);
    const { machineService, publishedReview } = useContext(
        ReviewTaskMachineContext
    );
    const isReport = useSelector(machineService, reportSelector);
    const isCrossChecking = useSelector(machineService, crossCheckingSelector);
    const isReviewing = useSelector(machineService, reviewingSelector);
    const isPublished =
        useSelector(machineService, publishedSelector) ||
        publishedReview?.review;
    const isPartialReview = useSelector(
        machineService,
        isPartialReviewSelector
    );
    const userIsAdmin = role === Roles.Admin || role === Roles.SuperAdmin;

    const showReport =
        (isPublished && (!isHidden || userIsNotRegular)) ||
        (isCrossChecking && (userIsAdmin || userIsCrossChecker)) ||
        (isReviewing && (userIsAdmin || userIsReviewer)) ||
        (isReport && (userIsAdmin || userIsAssignee || userIsCrossChecker));

    const showClassification =
        (isCrossChecking && (userIsAdmin || userIsCrossChecker)) ||
        (isReviewing && (userIsAdmin || userIsReviewer)) ||
        (isReport && (userIsAdmin || userIsAssignee || userIsCrossChecker));

    return (
        showReport && (
            <Row
                style={
                    (isCrossChecking || isReport || isReviewing) && {
                        backgroundColor: colors.lightGray,
                    }
                }
            >
                {isPublished && isPartialReview && <PartialReviewWarning />}
                <Col offset={3} span={18}>
                    <SentenceReportContent
                        context={context?.reviewDataHtml || context}
                        classification={context.classification}
                        showClassification={showClassification}
                    />
                    {!isLoggedIn && <CTARegistration />}
                </Col>
            </Row>
        )
    );
};

export default SentenceReportView;
