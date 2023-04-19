import { Col, Row, Typography } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";
import { ContentModelEnum } from "../../types/enums";

import ClassificationText from "../ClassificationText";
import ImageClaim from "../ImageClaim";
import LocalizedDate from "../LocalizedDate";
import PersonalityMinimalCard from "../Personality/PersonalityMinimalCard";
import SentenceReportCardStyle from "./SentenceReportCard.style";
import SentenceReportSummary from "./SentenceReportSummary";

const { Title, Paragraph } = Typography;

const SentenceReportCard = ({
    claim,
    personality,
    classification,
    content,
}: {
    personality?: any;
    claim: any;
    content: any;
    classification?: any;
}) => {
    const { t } = useTranslation();
    const isImage = claim?.contentModel === ContentModelEnum.Image;

    const contentProps = {
        [ContentModelEnum.Speech]: {
            linkText: "claim:cardLinkToFullText",
            contentPath: `/personality/${personality?.slug}/claim/${claim?.slug}`,
            title: `"(...) ${content.content}"`,
            speechTypeTranslation: "claim:typeSpeech",
        },
        [ContentModelEnum.Image]: {
            linkText: "claim:cardLinkToImage",
            contentPath: personality
                ? `/personality/${personality?.slug}/claim/${claim?.slug}`
                : `/claim/${claim?._id}`,
            title: claim.title,
            speechTypeTranslation: "",
        },
        [ContentModelEnum.Debate]: {
            linkText: "claim:cardLinkToDebate",
            contentPath: `/claim/${claim?._id}/debate`,
            title: `"(...) ${content.content}"`,
            speechTypeTranslation: "claim:typeDebate",
        },
    };

    const { linkText, contentPath, title, speechTypeTranslation } =
        contentProps[claim?.contentModel];

    return (
        <SentenceReportCardStyle>
            <Row className="main-content">
                {personality && (
                    <Col md={6} sm={24}>
                        <PersonalityMinimalCard personality={personality} />
                    </Col>
                )}
                <Col md={18} sm={24} className="sentence-card">
                    {classification && (
                        <Title className="classification" level={1}>
                            {
                                // TODO: Create a more meaningful h1 for this page
                                t("claimReview:claimReview")
                            }
                            <ClassificationText
                                classification={classification}
                            />
                        </Title>
                    )}
                    <SentenceReportSummary
                        className={personality ? "after" : ""}
                    >
                        <Paragraph className="sentence-content">
                            <cite>{title}</cite>
                            {isImage && (
                                <ImageClaim
                                    src={content?.content}
                                    title={title}
                                />
                            )}
                            <a href={contentPath}>{t(linkText)}</a>
                        </Paragraph>
                    </SentenceReportSummary>
                    <Paragraph className="claim-info">
                        {isImage
                            ? t("claim:cardHeader3")
                            : t("claim:cardHeader1")}
                        &nbsp;
                        <LocalizedDate date={claim?.date} />
                        &nbsp;
                        {!isImage && t("claim:cardHeader2")}&nbsp;
                        <strong>{t(speechTypeTranslation)}</strong>
                    </Paragraph>
                </Col>
            </Row>
        </SentenceReportCardStyle>
    );
};

export default SentenceReportCard;
