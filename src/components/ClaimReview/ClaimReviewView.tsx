import React, { useState } from "react";
import ClaimSentenceCard from "./ClaimSentenceCard";
import { Button, Col, Row } from "antd";
import ClaimReviewForm from "./ClaimReviewForm";
import ClaimReviewList from "./ClaimReviewList";
import ClassificationText from "../ClassificationText";
import { useTranslation } from "next-i18next";

const ClaimReviewView = ({ personality, claim, sentence, sitekey }) => {
    const { t } = useTranslation();
    const personalityId = personality._id;
    const claimId = claim._id;
    const sentenceHash = sentence?.props["data-hash"];
    const stats = sentence?.stats;
    const review = sentence?.props?.topClassification;

    const [ formCollapsed, setFormCollapsed ] = useState(true);

    const toggleFormCollapse = () => {
        setFormCollapsed(!formCollapsed);
    };

    return (
        <>
            <Row>
                <ClaimSentenceCard
                    personality={personality}
                    sentence={sentence}
                />
            </Row>
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
                <Row>
                    {!sentence.userReview && (
                        <>
                            <Col span={16}>
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
                            <Col span={8}>
                                <Button
                                    shape="round"
                                    type="primary"
                                    onClick={toggleFormCollapse}
                                >
                                    Review
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
