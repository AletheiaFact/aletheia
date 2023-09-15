import { useSelector } from "@xstate/react";
import { Col, Row } from "antd";
import { useTranslation } from "next-i18next";
import React, { useContext, useEffect, useState } from "react";

import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import { ClassificationEnum, Roles, TargetModel } from "../../types/enums";
import {
    crossCheckingSelector,
    publishedSelector,
    reviewDataSelector,
    reviewNotStartedSelector,
} from "../../machines/reviewTask/selectors";
import { useAppSelector } from "../../store/store";
import colors from "../../styles/colors";
import AletheiaAlert from "../AletheiaAlert";
import Banner from "../SentenceReport/Banner";
import SentenceReportCard from "../SentenceReport/SentenceReportCard";
import TopicInput from "./TopicInput";
import { Content } from "../../types/Content";
import { useAtom } from "jotai";
import { currentUserRole, isUserLoggedIn } from "../../atoms/currentUser";

interface ClaimReviewHeaderProps {
    personality?: string;
    claim: any;
    content: Content;
    classification?: ClassificationEnum;
    hideDescription: string;
    userIsReviewer: boolean;
    userIsAssignee: boolean;
    userIsNotRegular: boolean;
}

const ClaimReviewHeader = ({
    personality,
    claim,
    content,
    classification,
    hideDescription,
    userIsReviewer,
    userIsAssignee,
    userIsNotRegular,
}: ClaimReviewHeaderProps) => {
    const { t } = useTranslation();
    const { vw } = useAppSelector((state) => state);
    const [isLoggedIn] = useAtom(isUserLoggedIn);
    const [role] = useAtom(currentUserRole);

    const { machineService, publishedReview } = useContext(
        ReviewTaskMachineContext
    );
    const isHidden = publishedReview?.review?.isHidden;
    const [hide, setHide] = useState(isHidden);

    const reviewData = useSelector(machineService, reviewDataSelector);
    const reviewNotStarted = useSelector(
        machineService,
        reviewNotStartedSelector
    );
    const isCrossChecking = useSelector(machineService, crossCheckingSelector);
    const userHasPermission = userIsReviewer || userIsAssignee;
    const isPublished =
        useSelector(machineService, publishedSelector) ||
        publishedReview?.review;
    const isPublishedOrCanSeeHidden =
        isPublished && (!isHidden || userIsNotRegular);
    const userIsAdmin = role === Roles.Admin;

    const alertTypes = {
        hiddenReport: {
            show: true,
            description: hideDescription?.[TargetModel.ClaimReview],
            title: "claimReview:warningAlertTitle",
        },
        crossChecking: {
            show: true,
            description: "",
            title: "claimReviewTask:crossCheckingAlertTitle",
        },
        rejected: {
            show: true,
            description: reviewData.rejectionComment,
            title: "claimReviewTask:rejectionAlertTitle",
        },
        hasStarted: {
            show: true,
            description: "",
            title: "claimReviewTask:hasStartedAlertTitle",
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
            if (isCrossChecking && (userIsAdmin || userHasPermission)) {
                return alertTypes.crossChecking;
            }
            if (
                (userIsAdmin || userIsAssignee) &&
                reviewData.rejectionComment
            ) {
                return alertTypes.rejected;
            }
            if (!userHasPermission && !userIsAdmin && !reviewNotStarted) {
                return alertTypes.hasStarted;
            }
        }
        return alertTypes.noAlert;
    };

    const showClassification =
        isPublishedOrCanSeeHidden || (isCrossChecking && userHasPermission);

    useEffect(() => {
        const newAlert = getAlert();
        setAlert(newAlert);
    }, [isCrossChecking, hide, isLoggedIn, reviewData.rejectionComment]);

    useEffect(() => {
        setHide(isHidden);
    }, [isHidden]);

    return (
        <Row>
            <Col offset={3} span={18}>
                <Row
                    style={{
                        background: isPublished ? "none" : colors.lightGray,
                    }}
                >
                    <Col
                        lg={{
                            order: 1,
                            span: isPublishedOrCanSeeHidden ? 16 : 24,
                        }}
                        md={{ order: 2, span: 24 }}
                        sm={{ order: 2, span: 24 }}
                        xs={{ order: 2, span: 24 }}
                        className="sentence-report-card"
                        style={{
                            paddingRight: vw?.md ? "0" : " 20px",
                        }}
                    >
                        <SentenceReportCard
                            personality={personality}
                            claim={claim}
                            content={content}
                            classification={
                                showClassification ? classification : ""
                            }
                            hideDescription={
                                hideDescription?.[TargetModel.Claim]
                            }
                        />
                        <div
                            style={{
                                margin: "16px",
                                width: "calc(100% - 16px)",
                            }}
                        >
                            <TopicInput
                                contentModel={claim.contentModel}
                                data_hash={content.data_hash}
                                topics={content.topics}
                            />
                        </div>
                    </Col>
                    {alert.show && (
                        <Col
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
                        </Col>
                    )}
                </Row>
            </Col>
        </Row>
    );
};

export default ClaimReviewHeader;
