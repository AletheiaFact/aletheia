import { useSelector } from "@xstate/react";
import { Col, Row } from "antd";
import React, { useContext } from "react";

import { GlobalStateMachineContext } from "../../Context/GlobalStateMachineProvider";
import {
    crossCheckingSelector,
    isPartialReviewSelector,
    publishedSelector,
} from "../../machine/selectors";
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
    const { isLoggedIn } = useAppSelector((state) => {
        return {
            isLoggedIn: state?.login,
        };
    });
    const { machineService, publishedReview } = useContext(
        GlobalStateMachineContext
    );
    const isCrossChecking = useSelector(machineService, crossCheckingSelector);
    const isPublished =
        useSelector(machineService, publishedSelector) ||
        publishedReview?.review;
    const isPartialReview = useSelector(
        machineService,
        isPartialReviewSelector
    );

    const showReport =
        (isPublished && (!isHidden || userIsNotRegular)) ||
        (isCrossChecking && userIsReviewer);

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
