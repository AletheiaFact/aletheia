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

const { Paragraph } = Typography;

const CommentStyled = styled(Comment)`
    .ant-comment-inner {
        padding: 0;
    }
`;

const ClaimCard = ({ personality, claim }) => {
    const { t } = useTranslation();
    const review = claim?.stats?.reviews[0];
    const [claimContent, setClaimContent] = useState("");

    const CreateFirstParagraph = () => {
        let textContent = "";
        claim.content.forEach((paragraph) => {
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
            <Row>
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
                            <Col>
                                <Paragraph
                                    style={{ marginBottom: 0 }}
                                    ellipsis={{
                                        rows: 4,
                                        expandable: false,
                                    }}
                                >
                                    <cite style={{ fontStyle: "normal" }}>
                                        <p
                                            style={{
                                                fontSize: 16,
                                                color: colors.blackPrimary,
                                                fontWeight: 400,
                                                margin: 0,
                                                lineHeight: 1.6,
                                                height: "6.4em",
                                            }}
                                        >
                                            {claimContent || claim?.title}
                                        </p>
                                    </cite>
                                </Paragraph>
                                <a
                                    href={`/personality/${personality.slug}/claim/${claim.slug}`}
                                    style={{
                                        fontSize: 14,
                                        color: colors.bluePrimary,
                                        fontWeight: "bold",
                                        textDecoration: "underline",
                                    }}
                                    data-cy={"testSeeFullSpeech"}
                                >
                                    {t("claim:cardLinkToFullText")}
                                </a>
                            </Col>
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
