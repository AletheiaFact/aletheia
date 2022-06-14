import React, { useState } from "react";
import ClaimSentenceCard from "./ClaimSentenceCard";
import { Row } from "antd";
import ClaimReviewList from "./ClaimReviewList";
import ClassificationText from "../ClassificationText";
import { useTranslation } from "next-i18next";
import colors from "../../styles/colors";
import Button, { ButtonType } from "../Button";
import { PlusOutlined } from "@ant-design/icons";
import SocialMediaShare from "../SocialMediaShare";
import DynamicForm from "./form/DynamicForm";

const ClaimReviewView = ({ personality, claim, sentence, href, claimReviewTask }) => {
    const { t } = useTranslation();
    const claimId = claim._id;
    const sentenceHash = sentence?.props["data-hash"];
    const stats = sentence?.stats;
    const review = sentence?.props?.topClassification;
    const [formCollapsed, setFormCollapsed] = useState(claimReviewTask ? false : true);

    const toggleFormCollapse = () => {
        setFormCollapsed(!formCollapsed);
    };

    return (
        <>
            <Row
                style={{
                    background: colors.lightGray,
                    margin: "2px -15px 0px -15px",
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
                {sentence.userReview && (
                    <Row
                        style={{
                            justifyContent: "center",
                            flexWrap: "wrap"
                        }}
                    >
                        <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
                            <p style={{ marginBottom: 0 }}>
                                {t("claimReview:userReviewPrefix")}&nbsp;
                            </p>
                            <ClassificationText
                                classification={
                                    sentence.userReview?.classification
                                }
                            />
                        </div>
                        <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
                            <p style={{ marginBottom: 0 }}>
                                {t("claimReview:userReviewSuffix", {
                                    count: review?.count
                                })}
                                &nbsp;
                            </p>
                            <ClassificationText
                                classification={review?.classification}
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
                                {!review &&
                                    <Button
                                        type={ButtonType.blue}
                                        onClick={toggleFormCollapse}
                                        icon={<PlusOutlined />}
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
                    />
                }
            </Row>
            <Row>
                <ClaimReviewList
                    sentenceHash={sentenceHash}
                    claimId={claimId}
                />
            </Row>
            <SocialMediaShare quote={personality?.name} href={href} claim={claim?.title} />
        </>
    )
}

export default ClaimReviewView;
