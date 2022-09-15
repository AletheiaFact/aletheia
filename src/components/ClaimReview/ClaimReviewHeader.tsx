import { Row, Col } from "antd";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import ClaimReviewApi from "../../api/claimReviewApi";
import { Roles } from "../../machine/enums";
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
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();
    const { vw, role } = useAppSelector((state) => state);

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
                <Row>
                    <Col
                        lg={{ order: 1, span: isPublished ? 16 : 24 }}
                        md={{ order: 2, span: 24 }}
                        sm={{ order: 2, span: 24 }}
                        xs={{ order: 2, span: 24 }}
                        className="sentence-report-card"
                        style={{
                            paddingRight: vw?.md ? "0" : " 20px",
                            background: isPublished
                                ? colors.white
                                : colors.lightGray,
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
                    {hide && (
                        <Col style={{ marginTop: 16, width: "100%" }} order={3}>
                            <AletheiaAlert
                                type="warning"
                                message={t("claimReview:warningAlertTitle")}
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
