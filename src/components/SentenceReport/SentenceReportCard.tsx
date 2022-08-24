import { Col, Row, Typography } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";

import AletheiaAvatar from "../AletheiaAvatar";
import ClassificationText from "../ClassificationText";
import LocalizedDate from "../LocalizedDate";
import SentenceReportCardStyle from "./SentenceReportCard.style";
import SentenceReportSummary from "./SentenceReportSummary";

const { Title, Paragraph } = Typography;

const SentenceReportCard = ({
    claim,
    personality,
    context,
    sentence,
}: {
    personality: any;
    claim: any;
    sentence: any;
    context: any;
}) => {
    const { t } = useTranslation();
    const speechTypeTranslation =
        claim?.contentModel === "Speech"
            ? t("claim:typeSpeech")
            : t("claim:typeTwitter");

    return (
        <SentenceReportCardStyle>
            <Row className="main-content">
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
                <Col md={18} sm={24} className="sentence-card">
                    <Title className="classification" level={1}>
                        {
                            // TODO: Create a more meaningful h1 for this page
                            t("claimReview:claimReview")
                        }
                        <ClassificationText
                            classification={context.classification}
                        />
                    </Title>
                    <SentenceReportSummary>
                        <Paragraph
                            ellipsis={{
                                rows: 3,
                                expandable: false,
                            }}
                            className="sentence-content"
                        >
                            <cite>"(...) {sentence?.content}"</cite>
                            <a
                                href={`/personality/${personality.slug}/claim/${claim.slug}`}
                            >
                                {t("claim:cardLinkToFullText")}
                            </a>
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
