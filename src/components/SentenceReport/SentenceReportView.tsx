import React, { useState } from "react";
import { Col, Row } from "antd";
import SocialMediaShare from "../SocialMediaShare";
import SentenceReportCard from "./SentenceReportCard";
import Banner from "./Banner";
import CTARegistration from "../Home/CTARegistration";
import SentenceReportViewStyle from "./SentenceReportView.style";
import SentenceReportContent from "./SentenceReportContent";
import { useAppSelector } from "../../store/store";
import ReviewApi from "../../api/claimReviewApi";
import { useTranslation } from "next-i18next";
import HideReviewModal from "../Modal/HideReviewModal";
import UnhideReviewModal from "../Modal/UnhideReview";
import AletheiaAlert from "../AletheiaAlert";
import HideContentButton from "../HideContentButton";

const SentenceReportView = ({
    personality,
    claim,
    sentence,
    href,
    isHidden,
    context,
    sitekey,
    hideDescription,
    role,
}) => {
    const { t } = useTranslation();
    const { isLoggedIn } = useAppSelector((state) => ({
        isLoggedIn: state.login,
    }));

    const [isHideModalVisible, setIsHideModalVisible] = useState(false);
    const [isUnhideModalVisible, setIsUnhideModalVisible] = useState(false);
    const [description, setDescription] = useState(hideDescription);
    const [hide, setHide] = useState(isHidden);

    return (
        <>
            <SentenceReportViewStyle>
                <Row>
                    <Col offset={3} span={18}>
                        <Row>
                            <Col
                                lg={{ order: 1, span: 16 }}
                                md={{ order: 2, span: 24 }}
                                sm={{ order: 2, span: 24 }}
                                xs={{ order: 2, span: 24 }}
                                className="sentence-report-card"
                            >
                                {role && role === "admin" && (
                                    <Col
                                        style={{
                                            marginTop: 10,
                                            textAlign: "right",
                                            height: 32,
                                        }}
                                    >
                                        <HideContentButton
                                            hide={hide}
                                            handleHide={() =>
                                                setIsUnhideModalVisible(
                                                    !isUnhideModalVisible
                                                )
                                            }
                                            handleUnhide={() =>
                                                setIsHideModalVisible(
                                                    !isHideModalVisible
                                                )
                                            }
                                        />
                                    </Col>
                                )}
                                <SentenceReportCard
                                    personality={personality}
                                    claim={claim}
                                    sentence={sentence}
                                    context={context}
                                />
                            </Col>
                            <Col
                                lg={{ order: 2, span: 8 }}
                                md={{ order: 1, span: 24 }}
                            >
                                <Banner />
                            </Col>

                            {hide && (
                                <Col
                                    style={{ marginTop: 16, width: "100%" }}
                                    order={3}
                                >
                                    <AletheiaAlert
                                        type="warning"
                                        message={t(
                                            "claimReview:warningAlertTitle"
                                        )}
                                        description={description}
                                        showIcon={true}
                                    />
                                </Col>
                            )}

                            <Col order={4}>
                                <SentenceReportContent
                                    context={context}
                                    personality={personality}
                                    claim={claim}
                                />
                            </Col>
                        </Row>
                        {!isLoggedIn && <CTARegistration />}
                    </Col>
                    <Col span={24}>
                        <SocialMediaShare
                            quote={personality?.name}
                            href={href}
                            claim={claim?.title}
                        />
                    </Col>
                </Row>
            </SentenceReportViewStyle>

            <HideReviewModal
                visible={isHideModalVisible}
                handleOk={({ description, recaptcha }) => {
                    ReviewApi.hideReview(
                        sentence.data_hash,
                        !hide,
                        t,
                        description,
                        recaptcha
                    ).then(() => {
                        setHide(!hide);
                        setIsHideModalVisible(!isHideModalVisible);
                        setDescription(description);
                    });
                }}
                handleCancel={() => setIsHideModalVisible(false)}
                sitekey={sitekey}
            />

            <UnhideReviewModal
                visible={isUnhideModalVisible}
                handleOk={() =>
                    ReviewApi.hideReview(sentence.data_hash, !hide, t).then(
                        () => {
                            setHide(!hide);
                            setIsUnhideModalVisible(!isUnhideModalVisible);
                        }
                    )
                }
                handleCancel={() =>
                    setIsUnhideModalVisible(!isUnhideModalVisible)
                }
            />
        </>
    );
};

export default SentenceReportView;
