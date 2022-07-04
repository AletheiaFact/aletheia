import React, { useState } from "react";
import ClaimSentenceCard from "./ClaimSentenceCard";
import { Col, Row } from "antd";
import ClassificationText from "../ClassificationText";
import { useTranslation } from "next-i18next";
import colors from "../../styles/colors";
import Button, { ButtonType } from "../Button";
import { PlusOutlined } from "@ant-design/icons";
import SocialMediaShare from "../SocialMediaShare";
import DynamicForm from "./form/DynamicForm";

const ClaimReviewView = ({ personality, claim, sentence, href, claimReviewTask, isLoggedIn, review, sitekey }) => {
    const { t } = useTranslation();
    const claimId = claim._id;
    const personalityId = personality._id;
    const sentenceHash = sentence?.props["data-hash"];
    const stats = sentence?.stats;
    const [formCollapsed, setFormCollapsed] = useState(claimReviewTask ? false : true);

    const toggleFormCollapse = () => {
        setFormCollapsed(!formCollapsed);
    };

    return (
        <>
            <Col
                offset={3}
                span={18}
                style={{
                    background: colors.lightGray,
                    padding: "0px 15px",
                    boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.15)"
                }}
            >
                <ClaimSentenceCard
                    personality={personality}
                    sentence={sentence}
                    summaryClassName="claim-review"
                    claimType={claim?.type}
                />
                {review && (
                    <Row
                        style={{
                            justifyContent: "center",
                            flexWrap: "wrap",
                            width: "100%",
                            paddingBottom: "1em"
                        }}
                    >
                        <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
                            <p style={{ marginBottom: 0 }}>
                                {t("claimReview:claimReview")}&nbsp;
                            </p>
                            <ClassificationText
                                classification={
                                    sentence.props?.classification
                                }
                            />
                        </div>
                    </Row>
                )}
                {formCollapsed && (
                    <Row style={{ width: "100%", padding: "0px 0px 15px 0px", justifyContent: 'space-between' }}>
                        {!sentence.userReview && (
                            <>
                                <span
                                    style={{
                                        fontSize: "14px"
                                    }}
                                >
                                    {t("claim:metricsHeaderInfo", {
                                        totalReviews: stats?.total
                                    })}
                                </span>{" "}
                                <br />
                                {review && (
                                    <span
                                        style={{
                                            fontSize: "10px"
                                        }}
                                    >
                                        {t(
                                            "claim:cardOverallReviewPrefix"
                                        )}{" "}
                                        <ClassificationText
                                            classification={
                                                review?.classification
                                            }
                                        />
                                        ({review?.count})
                                    </span>
                                )}
                                {!review && isLoggedIn &&
                                    <Button
                                        type={ButtonType.blue}
                                        onClick={toggleFormCollapse}
                                        icon={<PlusOutlined />}
                                        data-cy={"testAddReviewButton"}
                                    >
                                        {t("claimReviewForm:addReviewButton")}
                                    </Button>
                                }
                            </>
                        )}
                    </Row>
                )}
                {!formCollapsed &&
                    <DynamicForm
                        sentence_hash={sentenceHash}
                        personality={personalityId}
                        claim={claimId}
                        isLoggedIn={isLoggedIn}
                        sitekey={sitekey}
                    />
                }
            </Col>
            <SocialMediaShare quote={personality?.name} href={href} claim={claim?.title} />
        </>
    )
}

export default ClaimReviewView;
