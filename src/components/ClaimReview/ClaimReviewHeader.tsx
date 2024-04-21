import { useSelector } from "@xstate/react";
import { Col, Row } from "antd";
import { useTranslation } from "next-i18next";
import React, { useContext, useEffect, useState } from "react";

import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import { ClassificationEnum, Roles, TargetModel } from "../../types/enums";
import {
    reviewingSelector,
    publishedSelector,
    reviewNotStartedSelector,
    crossCheckingSelector,
} from "../../machines/reviewTask/selectors";
import { useAppSelector } from "../../store/store";
import colors from "../../styles/colors";
import AletheiaAlert from "../AletheiaAlert";
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
    componentStyle: any;
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
    componentStyle,
}: ClaimReviewHeaderProps) => {
    const { t } = useTranslation();
    const { reviewDrawerCollapsed } = useAppSelector((state) => ({
        reviewDrawerCollapsed:
            state?.reviewDrawerCollapsed !== undefined
                ? state?.reviewDrawerCollapsed
                : true,
    }));
    const [isLoggedIn] = useAtom(isUserLoggedIn);
    const [role] = useAtom(currentUserRole);

    const { machineService, publishedReview } = useContext(
        ReviewTaskMachineContext
    );
    const isHidden = publishedReview?.review?.isHidden;
    const [hide, setHide] = useState(isHidden);

    const reviewNotStarted = useSelector(
        machineService,
        reviewNotStartedSelector
    );
    const isCrossChecking = useSelector(machineService, crossCheckingSelector);
    const isReviewing = useSelector(machineService, reviewingSelector);
    const userHasPermission = userIsReviewer || userIsAssignee;
    const isPublished =
        useSelector(machineService, publishedSelector) ||
        publishedReview?.review;
    const isPublishedOrCanSeeHidden =
        isPublished && (!isHidden || userIsNotRegular);
    const userIsAdmin = role === Roles.Admin || role === Roles.SuperAdmin;

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
        reviewing: {
            show: true,
            description: "",
            title: "claimReviewTask:reviewingAlertTitle",
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

    useEffect(() => {
        setHide(isHidden);
    }, [isHidden]);

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
