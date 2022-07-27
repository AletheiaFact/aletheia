import React from "react";
import { Avatar, Col, Row, Typography } from "antd";
import { useTranslation } from "next-i18next";
import colors from "../../styles/colors";
import SentenceReportSummary from "./SentenceReportSummary";
import ClassificationText from "../ClassificationText";
import LocalizedDate from "../LocalizedDate";
import SentenceReportCardStyle from "./SetenceReportCard.style";

const { Title, Paragraph } = Typography;

const SentenceReportCard = ({
    claim,
    personality,
    date,
    context,
    sentence,
    claimType = "speech",
}: {
    personality: any;
    claim: any;
    sentence: any;
    date: any;
    claimType: string;
    context: any;
}) => {
    const { t } = useTranslation();
    const speechTypeTranslation =
        claimType === "speech" ? t("claim:typeSpeech") : t("claim:typeTwitter");

    return (
        <SentenceReportCardStyle>
            <Row gutter={40} className="main-content">
                <Col md={6} sm={24}>
                    <Row className="content-card">
                        <Col>
                            <Avatar
                                size={133}
                                src={personality.image}
                                alt={t("seo:personalityImageAlt", {
                                    name: personality.name,
                                })}
                            />
                        </Col>
                        <Row>
                            <Col className="personality">
                                <Title
                                    style={{
                                        marginBottom: 0,
                                        marginTop: "16px",
                                        color: colors.bluePrimary,
                                        fontSize: 16,
                                        lineHeight: "20px",
                                        fontWeight: 400,
                                    }}
                                    className="personality-name"
                                >
                                    {personality.name}
                                </Title>
                                <Paragraph
                                    className="personality-description"
                                    style={{
                                        marginTop: "4px",
                                        fontSize: "10px",
                                        lineHeight: "14px",
                                        color: colors.blackSecondary,
                                    }}
                                >
                                    {personality.description}
                                    <br />
                                    <a
                                        href={`/personality/${personality.slug}`}
                                        style={{
                                            color: colors.blackSecondary,
                                            textDecoration: "underline",
                                            fontWeight: 700,
                                        }}
                                    >
                                        {t("personality:profile_button")}
                                    </a>
                                </Paragraph>
                            </Col>
                        </Row>
                    </Row>
                </Col>
                <Col md={18} sm={24} style={{ marginTop: -20 }}>
                    <div
                        style={{
                            display: "flex",
                            width: "100%",
                            fontWeight: 800,
                            marginTop: "18px",
                            marginLeft: "8px",
                            marginBottom: "16px",
                        }}
                        className="context-classification"
                    >
                        <Title
                            level={2}
                            style={{
                                marginBottom: 0,
                                color: colors.blackSecondary,
                                fontSize: 16,
                                fontWeight: 400,
                                lineHeight: "20px",
                            }}
                        >
                            {t("claimReview:claimReview")}&nbsp;
                        </Title>
                        <ClassificationText
                            style={{
                                fontSize: 16,
                                lineHeight: "20px",
                            }}
                            classification={context.classification}
                        />
                    </div>
                    <SentenceReportSummary>
                        <Paragraph
                            ellipsis={{
                                rows: 3,
                                expandable: false,
                            }}
                            style={{
                                justifyContent: "center",
                                marginBottom: 0,
                            }}
                        >
                            <cite
                                style={{
                                    fontStyle: "normal",
                                    fontSize: 16,
                                    lineHeight: "24px",
                                    color: colors.blackSecondary,
                                    fontWeight: 400,
                                    margin: 0,
                                }}
                            >
                                {sentence?.content}
                            </cite>
                            <a
                                href={`/personality/${personality.slug}/claim/${claim.slug}`}
                                style={{
                                    color: colors.bluePrimary,
                                    fontWeight: "bold",
                                    fontSize: 16,
                                    lineHeight: "24px",
                                    marginLeft: 10,
                                }}
                            >
                                {t("claim:cardLinkToFullText")}
                            </a>
                        </Paragraph>
                    </SentenceReportSummary>
                    <Paragraph
                        style={{
                            fontSize: 10,
                            fontWeight: 400,
                            lineHeight: "15px",
                            marginTop: 16,
                        }}
                    >
                        {t("claim:cardHeader1")}&nbsp;
                        <LocalizedDate date={date} />
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
