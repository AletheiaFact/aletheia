import { Col, Comment, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import ReviewColors from "../../constants/reviewColors";
import CardBase from "../CardBase";
import ClaimSummary from "./ClaimSummary";
import Button, { ButtonType } from "../Button";
import ClaimCardHeader from "./ClaimCardHeader";
import colors from "../../styles/colors";
import styled from "styled-components";
import ClaimSummaryContent from "./ClaimSummaryContent";
import ClaimSpeechBody from "./ClaimSpeechBody";
import actions from "../../store/actions";
import { useDispatch } from "react-redux";

const { Paragraph } = Typography;

const CommentStyled = styled(Comment)`
    width: 100%;
    .ant-comment-inner {
        padding: 0;
    }
`;

const ClaimCard = ({ personality, claim, collapsed = true }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const review = claim?.stats?.reviews[0];
    const paragraphs = claim.content;
    const [claimContent, setClaimContent] = useState("");

    const dispatchPersonalityAndClaim = () => {
        dispatch(actions.setSelectClaim(claim));
        dispatch(actions.setSelectPersonality(personality));
    };

    const CreateFirstParagraph = () => {
        let textContent = "";
        paragraphs.forEach((paragraph) => {
            paragraph.content.forEach((sentence) => {
                return (textContent += `${sentence.content} `);
            });
        });
        setClaimContent(textContent.trim());
    };

    useEffect(() => {
        CreateFirstParagraph();
    }, []);

    if (!claim) {
        return <div></div>;
    }
    return (
        <CardBase style={{ padding: "16px 12px" }}>
            <Row style={{ width: "100%" }}>
                <CommentStyled
                    author={
                        <ClaimCardHeader
                            personality={personality}
                            date={claim?.date}
                            claimType={claim?.type}
                        />
                    }
                    content={
                        <ClaimSummary
                            style={{
                                padding: "12px 16px",
                                width: "100%",
                            }}
                        >
                            {collapsed ? (
                                <ClaimSummaryContent
                                    claimTitle={claim?.title}
                                    claimSlug={claim?.slug}
                                    claimContent={claimContent}
                                    personality={personality}
                                />
                            ) : (
                                <ClaimSpeechBody
                                    handleSentenceClick={
                                        dispatchPersonalityAndClaim
                                    }
                                    paragraphs={paragraphs}
                                    showHighlights={true}
                                />
                            )}
                        </ClaimSummary>
                    }
                />
            </Row>
            <Row
                style={{
                    padding: "4px 15px 0 0",
                    width: "100%",
                }}
                justify="space-between"
            >
                <Col
                    span={16}
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                    }}
                >
                    <p
                        style={{
                            width: "100%",
                            fontSize: "14px",
                            lineHeight: "18px",
                            color: colors.blackSecondary,
                            margin: 0,
                        }}
                    >
                        {t("claim:metricsHeaderInfo", {
                            totalReviews: claim?.stats?.total,
                        })}
                    </p>{" "}
                    <Paragraph
                        style={{
                            fontSize: "10px",
                            lineHeight: "18px",
                            marginTop: 5,
                            marginBottom: 0,
                            display: "flex",
                        }}
                    >
                        {review && (
                            <span style={{ margin: 0 }}>
                                {t("claim:cardOverallReviewPrefix")}
                                <span
                                    style={{
                                        color:
                                            ReviewColors[review?._id] || "#000",
                                        fontWeight: 900,
                                        textTransform: "uppercase",
                                        margin: "0px 3px",
                                    }}
                                >
                                    {t(`claimReviewForm:${review?._id}`)}
                                </span>
                                ({0})
                            </span>
                        )}
                    </Paragraph>
                </Col>
                <Col>
                    <Button
                        type={ButtonType.blue}
                        href={`/personality/${personality.slug}/claim/${claim.slug}`}
                        data-cy={personality.name}
                    >
                        <span
                            style={{
                                color: colors.white,
                                fontSize: 16,
                                fontWeight: 400,
                                margin: 0,
                                padding: 0,
                                lineHeight: "24px",
                            }}
                        >
                            {t("claim:cardReviewButton")}
                        </span>
                    </Button>
                </Col>
            </Row>
        </CardBase>
    );
};

export default ClaimCard;
