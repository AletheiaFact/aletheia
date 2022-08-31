import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "antd";
import SocialMediaShare from "../SocialMediaShare";
import SentenceReportCard from "./SentenceReportCard";
import Banner from "./Banner";
import CTARegistration from "../Home/CTARegistration";
import SentenceReportViewStyle from "./SentenceReportView.style";
import SentenceReportContent from "./SentenceReportContent";
import { useAppSelector } from "../../store/store";
import ReviewApi from "../../api/claimReviewApi";
import { EyeInvisibleFilled, EyeFilled } from "@ant-design/icons";
import colors from "../../styles/colors";
import { useTranslation } from "next-i18next";
import HideReviewModal from "../Modal/HideReviewModal";
import WarningModal from "../Modal/WarningModal";
import UnhideReviewModal from "../Modal/UnhideReview";
import { ory } from "../../lib/orysdk";

const SentenceReportView = ({
    personality,
    claim,
    sentence,
    href,
    isHidden,
    context,
    sitekey,
    hideDescription,
}) => {
    const { t } = useTranslation();
    const { isLoggedIn } = useAppSelector((state) => ({
        isLoggedIn: state.login,
    }));

    const [isHideModalVisible, setIsHideModalVisible] = useState(false);
    const [isUnhideModalVisible, setIsUnhideModalVisible] = useState(false);
    const [role, setRole] = useState(null);
    const [hide, setHide] = useState(isHidden);

    useEffect(() => {
        (function getRole() {
            ory.toSession().then((session) => {
                setRole(session?.data?.identity?.traits?.role);
            });
        })();
    }, []);

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
                                        }}
                                    >
                                        {hide ? (
                                            <Button
                                                onClick={() =>
                                                    setIsUnhideModalVisible(
                                                        !isUnhideModalVisible
                                                    )
                                                }
                                                style={{
                                                    padding: "5px",
                                                    background: "none",
                                                    border: "none",
                                                    fontSize: 16,
                                                    color: colors.bluePrimary,
                                                }}
                                            >
                                                <EyeFilled />
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={() =>
                                                    setIsHideModalVisible(
                                                        !isHideModalVisible
                                                    )
                                                }
                                                style={{
                                                    padding: "5px",
                                                    background: "none",
                                                    border: "none",
                                                    fontSize: 16,
                                                    color: colors.bluePrimary,
                                                    textAlign: "right",
                                                }}
                                            >
                                                <EyeInvisibleFilled />
                                            </Button>
                                        )}
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
                            <Col order={3}>
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
                    });
                }}
                handleCancel={() => setIsHideModalVisible(false)}
                sitekey={sitekey}
            />

            <WarningModal
                width={"90%"}
                hideDescription={hideDescription}
                visible={role === "fact-checker" && isHidden}
                closable={false}
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
