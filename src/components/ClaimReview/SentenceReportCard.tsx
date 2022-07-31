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
    summarized: boolean;
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
                                size={117}
                                src={personality.image}
                                alt={t("seo:personalityImageAlt", {
                                    name: personality.name,
                                })}
                                style={{
                                    outlineColor: colors.blueQuartiary,
                                    outlineStyle: "solid",
                                    outlineWidth: "2px",
                                    outlineOffset: "4px",
                                }}
                            />
                        </Col>
                        <Row>
                            <Col className="personality">
                                <Title
                                    style={{
                                        marginBottom: 0,
                                        marginTop: "3px",
                                    }}
                                    className="personality-name"
                                >
                                    {personality.name}
                                </Title>
                                <Paragraph
                                    className="personality-description"
                                    style={{
                                        fontSize: "10px",
                                    }}
                                >
                                    {personality.description}
                                    <br />
                                    <a
                                        href={`/personality/${personality.slug}`}
                                        style={{
                                            color: colors.blackPrimary,
                                            textDecoration: "underline",
                                            fontWeight: "bold",
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
                        }}
                        className="context-classification"
                    >
                        <p style={{ marginBottom: 0 }}>
                            {t("claimReview:claimReview")}&nbsp;
                        </p>
                        <ClassificationText
                            classification={context.classification}
                        />
                    </div>
                    <SentenceReportSummary data-cy="taOnde">
                        <Paragraph
                            ellipsis={{
                                rows: 3,
                                expandable: false,
                            }}
                            style={{ justifyContent: "center" }}
                        >
                            <cite
                                style={{
                                    fontStyle: "normal",
                                    fontSize: 20,
                                    color: colors.blackPrimary,
                                    fontWeight: 400,
                                    margin: 0,
                                    lineHeight: 1.5715,
                                }}
                            >
                                {sentence?.content}
                            </cite>
                        </Paragraph>
                        <a
                            href={`/personality/${personality.slug}/claim/${claim.slug}`}
                            style={{
                                color: colors.blackPrimary,
                                fontWeight: "bold",
                                fontSize: "20px",
                                marginLeft: 10,
                            }}
                        >
                            {t("claim:cardLinkToFullText")}
                        </a>
                    </SentenceReportSummary>
                    <Title
                        level={3}
                        style={{
                            fontSize: 10,
                            fontWeight: 400,
                            lineHeight: "15px",
                            marginBottom: 21,
                            marginTop: 10,
                            paddingLeft: "8px",
                        }}
                    >
                        {t("claim:cardHeader1")}&nbsp;
                        <LocalizedDate date={date} />
                        &nbsp;
                        {t("claim:cardHeader2")}&nbsp;
                        <strong>{speechTypeTranslation}</strong>
                    </Title>
                </Col>
            </Row>
        </SentenceReportCardStyle>
    );
};

export default SentenceReportCard;
