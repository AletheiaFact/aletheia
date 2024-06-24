import { useSelector } from "@xstate/react";
import { Col, Row } from "antd";
import React, { useContext } from "react";

import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import { ClassificationEnum, TargetModel } from "../../types/enums";
import { publishedSelector } from "../../machines/reviewTask/selectors";
import { useAppSelector } from "../../store/store";
import colors from "../../styles/colors";
import SentenceReportCard from "../SentenceReport/SentenceReportCard";
import TopicInput from "./TopicInput";
import { Content } from "../../types/Content";
import ReviewAlert from "./ReviewAlert";
import { ReviewTaskTypeEnum } from "../../machines/reviewTask/enums";

interface ClaimReviewHeaderProps {
    personality?: string;
    claim?: any;
    content: Content;
    classification?: ClassificationEnum;
    hideDescription: string;
    userIsNotRegular: boolean;
    componentStyle: any;
}

const ClaimReviewHeader = ({
    personality,
    content,
    classification,
    hideDescription,
    userIsNotRegular,
    componentStyle,
    claim,
}: ClaimReviewHeaderProps) => {
    const { reviewDrawerCollapsed } = useAppSelector((state) => ({
        reviewDrawerCollapsed:
            state?.reviewDrawerCollapsed !== undefined
                ? state?.reviewDrawerCollapsed
                : true,
    }));

    const { machineService, publishedReview, reviewTaskType } = useContext(
        ReviewTaskMachineContext
    );
    const isHidden = publishedReview?.review?.isHidden;
    const isPublished =
        useSelector(machineService, publishedSelector) ||
        publishedReview?.review;
    const isPublishedOrCanSeeHidden =
        isPublished && (!isHidden || userIsNotRegular);

    return (
        <Row style={{ background: isPublished ? "none" : colors.lightGray }}>
            <Col offset={componentStyle.offset} span={componentStyle.span}>
                <Row>
                    <Col
                        lg={{
                            order: 1,
                            span:
                                isPublishedOrCanSeeHidden &&
                                reviewDrawerCollapsed
                                    ? 16
                                    : 24,
                        }}
                        style={{ padding: 32 }}
                        md={{ order: 2, span: 24 }}
                        sm={{ order: 2, span: 24 }}
                        xs={{ order: 2, span: 24 }}
                        className="sentence-report-card"
                    >
                        <SentenceReportCard
                            personality={personality}
                            claim={claim}
                            content={content}
                            classification={
                                isPublishedOrCanSeeHidden ? classification : ""
                            }
                            hideDescription={
                                hideDescription?.[TargetModel.Claim]
                            }
                        />
                        {reviewTaskType === ReviewTaskTypeEnum.Claim && (
                            <TopicInput
                                contentModel={claim.contentModel}
                                data_hash={content.data_hash}
                                topics={content.topics}
                            />
                        )}
                    </Col>

                    <ReviewAlert
                        isHidden={isHidden}
                        isPublished={isPublished}
                        hideDescription={hideDescription}
                    />
                </Row>
            </Col>
        </Row>
    );
};

export default ClaimReviewHeader;
