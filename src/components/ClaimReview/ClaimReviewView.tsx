import React, { useState } from "react";
import ClaimSentenceCard from "./ClaimSentenceCard";
import { Col, Row } from "antd";
import ClaimReviewForm from "./ClaimReviewForm";
import ClaimReviewList from "./ClaimReviewList";
import ClassificationText from "../ClassificationText";
import { useTranslation } from "next-i18next";
import colors from "../../styles/colors";
import Button, { ButtonType } from "../Button";

const ClaimReviewView = ({ personality, claim, sentence, sitekey }) => {
    const { t } = useTranslation();
    const personalityId = personality._id;
    const claimId = claim._id;
    const sentenceHash = sentence?.props["data-hash"];
    const stats = sentence?.stats;
    const review = sentence?.props?.topClassification;

    const [formCollapsed, setFormCollapsed] = useState(true);

    const toggleFormCollapse = () => {
        setFormCollapsed(!formCollapsed);
    };

    return (
        <>
            <Row
                style={{
                    background: colors.lightGray,
                    margin: "2px -15px 0px -15px",
                    padding: "0px 15px"
                }}
            >
                <ClaimSentenceCard
                    personality={personality}
                    sentence={sentence}
                    summaryClassName="claim-review"
                />
                {sentence.userReview && (
                    <Row
                        style={{
                            justifyContent: "center"
                        }}
                    >
                        <div>
                            {t("claimReview:userReviewPrefix")}&nbsp;
                            <ClassificationText
                                classification={
                                    sentence.userReview?.classification
                                }
                                t={t}
                            />
                        </div>
                        <div>
                            {t("claimReview:userReviewSuffix", {
                                count: review?.count
                            })}
                            &nbsp;
                            <ClassificationText
                                classification={review?.classification}
                                t={t}
                            />
                        </div>
                    </Row>
                )}
                {formCollapsed && (
                    <Row style={{ width: "100%", padding: "0px 0px 15px 0px" }}>
                        {!sentence.userReview && (
                            <>
                                <Col span={14}>
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
                                                t={t}
                                            />
                                                ({review?.count})
                                            </span>
                                    )}
                                </Col>
                                <Col span={10}>
                                    <Button
                                        type={ButtonType.blue}
                                        onClick={toggleFormCollapse}
                                    >
                                        {t("claimReviewForm:addReviewButton")}
                                    </Button>
                                </Col>
                            </>
                        )}
                    </Row>
                )}
                {!formCollapsed && (
                    <Row>
                        <ClaimReviewForm
                            claimId={claimId}
                            personalityId={personalityId}
                            handleOk={toggleFormCollapse}
                            handleCancel={toggleFormCollapse}
                            highlight={sentence}
                            sitekey={sitekey}
                        />
                    </Row>
                )}
            </Row>
            <Row>
                <ClaimReviewList
                    sentenceHash={sentenceHash}
                    claimId={claimId}
                />
            </Row>
        </>
    )
}

export default ClaimReviewView;
