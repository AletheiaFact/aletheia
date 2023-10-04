import { useSelector } from "@xstate/react";
import { Col, Row } from "antd";
import React, { useContext } from "react";

import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import { Roles } from "../../types/enums";
import {
    crossCheckingSelector,
    isPartialReviewSelector,
    publishedSelector,
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
}) => {
    const [isLoggedIn] = useAtom(isUserLoggedIn);
    const [role] = useAtom(currentUserRole);
    const { machineService, publishedReview } = useContext(
        ReviewTaskMachineContext
    );
    const isCrossChecking = useSelector(machineService, crossCheckingSelector);
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
        (isCrossChecking && (userIsAdmin || userIsReviewer));

    return (
        showReport && (
            <div>
                <Row>
                    {isPublished && isPartialReview && <PartialReviewWarning />}
                    <Col
                        offset={3}
                        span={18}
                        style={
                            isCrossChecking && {
                                backgroundColor: colors.lightGray,
                                padding: "15px",
                            }
                        }
                    >
                        <SentenceReportContent
                            context={context?.reviewDataHtml || context}
                        />
                        {!isLoggedIn && <CTARegistration />}
                    </Col>
                </Row>
            </div>
        )
    );
};

export default SentenceReportView;
