import { useSelector } from "@xstate/react";
import { Col, Row } from "antd";
import React, { useContext } from "react";

import { ReviewTaskMachineContext } from "../../Context/ReviewTaskMachineProvider";
import { Roles } from "../../types/enums";
import {
    crossCheckingSelector,
    isPartialReviewSelector,
    publishedSelector,
} from "../../machines/reviewTask/selectors";
import { useAppSelector } from "../../store/store";
import colors from "../../styles/colors";
import CTARegistration from "../Home/CTARegistration";
import PartialReviewWarning from "../PartialReviewWarning";
import SentenceReportContent from "./SentenceReportContent";

const SentenceReportView = ({
    personality,
    claim,
    context,
    userIsNotRegular,
    userIsReviewer,
    isHidden,
}) => {
    const { login: isLoggedIn, role } = useAppSelector((state) => state);
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
    const userIsAdmin = role === Roles.Admin;

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
                            context={context}
                            personality={personality}
                            claim={claim}
                        />
                        {!isLoggedIn && <CTARegistration />}
                    </Col>
                </Row>
            </div>
        )
    );
};

export default SentenceReportView;
