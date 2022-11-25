/* eslint-disable @next/next/no-img-element */
import { Col, Row, Typography } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";
import { ContentModelEnum } from "../../types/enums";

import AletheiaAvatar from "../AletheiaAvatar";
import ClassificationText from "../ClassificationText";
import LocalizedDate from "../LocalizedDate";
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
    const speechTypeTranslation =
        claim?.contentModel === "Speech"
            ? t("claim:typeSpeech")
            : t("claim:typeTwitter");
    const title = isImage ? claim.title : `"(...) ${content.content}"`;
    const linkText = isImage
        ? "claim:cardLinkToImage"
        : "claim:cardLinkToFullText";

    let contentPath = personality
        ? `/personality/${personality?.slug}/claim`
        : `/claim`;
    contentPath += isImage
        ? `/${claim?._id}`
        : `/${claim?.slug}/sentence/${content.data_hash}`;

    return (
        <SentenceReportCardStyle>
            <Row className="main-content">
                {personality && (
                    <Col md={6} sm={24}>
                        <Row className="personality-card">
                            <Col>
                                <AletheiaAvatar
                                    size={117}
                                    src={personality.avatar}
                                    alt={t("seo:personalityImageAlt", {
                                        name: personality.name,
                                    })}
                                />
                            </Col>
                            <Col className="personality">
                                <Title level={2} className="personality-name">
                                    {personality.name}
                                </Title>
                                <Paragraph className="personality-description-content">
                                    <span className="personality-description">
                                        {personality.description}
                                    </span>
                                    <a
                                        className="personality-profile"
                                        href={`/personality/${personality.slug}`}
                                    >
                                        {t("personality:profile_button")}
                                    </a>
                                </Paragraph>
                            </Col>
                        </Row>
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
                                <img
                                    src={content?.content}
                                    alt={`${title} claim`}
                                    style={{
                                        maxWidth: "100%",
                                        maxHeight: "5.5em",
                                    }}
                                />
                            )}
                            <a href={contentPath}>{t(linkText)}</a>
                        </Paragraph>
                    </SentenceReportSummary>
                    <Paragraph className="claim-info">
                        {t("claim:cardHeader1")}&nbsp;
                        <LocalizedDate date={claim?.date} />
                        &nbsp;
                        {t("claim:cardHeader2")}&nbsp;
                        <strong>{speechTypeTranslation}</strong>
                    </Paragraph>
                </Col>
            </Row>
        </SentenceReportCardStyle>
    );
};

export default SentenceReportCard;
