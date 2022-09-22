import { Row, Col } from "antd";
import { useTranslation } from "next-i18next";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "@xstate/react";
import ClaimReviewApi from "../../api/claimReviewApi";
import { GlobalStateMachineContext } from "../../Context/GlobalStateMachineProvider";
import { Roles } from "../../machine/enums";
import {
    crossCheckingSelector,
    reviewDataSelector,
} from "../../machine/selectors";
import { useAppSelector } from "../../store/store";
import colors from "../../styles/colors";
import AletheiaAlert from "../AletheiaAlert";
import HideContentButton from "../HideContentButton";
import HideReviewModal from "../Modal/HideReviewModal";
import UnhideReviewModal from "../Modal/UnhideReviewModal";
import Banner from "../SentenceReport/Banner";
import SentenceReportCard from "../SentenceReport/SentenceReportCard";

const ClaimReviewHeader = ({
    personality,
    claim,
    sentence,
    isHidden,
    classification = "",
    sitekey,
    hideDescription,
    isPublished,
}) => {
    const [isHideModalVisible, setIsHideModalVisible] = useState(false);
    const [isUnhideModalVisible, setIsUnhideModalVisible] = useState(false);
    const [description, setDescription] = useState(hideDescription);
    const [hide, setHide] = useState(isHidden);
    const [showAlert, setShowAlert] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();
    const { vw, role } = useAppSelector((state) => state);

    const { machineService } = useContext(GlobalStateMachineContext);
    const reviewData = useSelector(machineService, reviewDataSelector);
    const isCrossChecking = useSelector(machineService, crossCheckingSelector);

    useEffect(() => {
        if (!isPublished) {
            setDescription(isCrossChecking ? "" : reviewData.rejectionComment);
            setShowAlert(!!reviewData.rejectionComment || isCrossChecking);
        } else {
            setDescription(hideDescription);
            setShowAlert(isHidden);
        }
    }, [
        isHidden,
        isCrossChecking,
        reviewData.rejectionComment,
        hideDescription,
        isPublished,
    ]);

    const getAlertTitle = (): string => {
        if (isHidden) {
            return "claimReview:warningAlertTitle";
        }
        if (isCrossChecking) {
            return "claimReviewTask:crossCheckingAlertTitle";
        }
        if (!!reviewData.rejectionComment) {
            return "claimReviewTask:rejectionAlertTitle";
        }
    };

    return (
        <Row>
            <Col offset={3} span={18}>
                {role === Roles.Admin && isPublished && (
                    <Col
                        style={{
                            marginBottom: 8,
                            display: "flex",
                            justifyContent: "flex-end",
                        }}
                    >
                        <div
                            style={{
                                width: "100%",
                                borderBottom: `1px solid ${colors.lightGraySecondary}`,
                            }}
                        ></div>
                        <HideContentButton
                            hide={hide}
                            handleHide={() => {
                                setIsUnhideModalVisible(!isUnhideModalVisible);
                            }}
                            handleUnhide={() =>
                                setIsHideModalVisible(!isHideModalVisible)
                            }
                            style={{
                                borderBottom: `1px solid ${colors.bluePrimary}`,
                                width: 26,
                            }}
                        />
                    </Col>
                )}
                <Row
                    style={{
                        background: isPublished
                            ? colors.white
                            : colors.lightGray,
                    }}
                >
                    <Col
                        lg={{ order: 1, span: isPublished ? 16 : 24 }}
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
                            sentence={sentence}
                            classification={classification}
                        />
                    </Col>
                    {isPublished && (
                        <Col
                            lg={{ order: 2, span: 8 }}
                            md={{ order: 1, span: 24 }}
                        >
                            <Banner />
                        </Col>
                    )}
                    {showAlert && (
                        <Col
                            style={{ margin: "16px", width: "100%" }}
                            order={3}
                        >
                            <AletheiaAlert
                                type="warning"
                                message={t(getAlertTitle())}
                                description={description}
                                showIcon={true}
                            />
                        </Col>
                    )}
                </Row>
            </Col>
            <HideReviewModal
                visible={isHideModalVisible}
                isLoading={isLoading}
                handleOk={({ description, recaptcha }) => {
                    setIsLoading(true);
                    ClaimReviewApi.hideReview(
                        sentence.data_hash,
                        !hide,
                        t,
                        recaptcha,
                        description
                    ).then(() => {
                        setHide(!hide);
                        setIsHideModalVisible(!isHideModalVisible);
                        setDescription(description);
                        setIsLoading(false);
                    });
                }}
                handleCancel={() => setIsHideModalVisible(false)}
                sitekey={sitekey}
            />

            <UnhideReviewModal
                visible={isUnhideModalVisible}
                isLoading={isLoading}
                handleOk={({ recaptcha }) => {
                    setIsLoading(true);
                    ClaimReviewApi.hideReview(
                        sentence.data_hash,
                        !hide,
                        t,
                        recaptcha
                    ).then(() => {
                        setHide(!hide);
                        setIsUnhideModalVisible(!isUnhideModalVisible);
                        setIsLoading(false);
                    });
                }}
                handleCancel={() =>
                    setIsUnhideModalVisible(!isUnhideModalVisible)
                }
                sitekey={sitekey}
            />
        </Row>
    );
};

export default ClaimReviewHeader;
