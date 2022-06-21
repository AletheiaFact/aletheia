import React from "react";
import { Avatar, Col, Row, Typography } from "antd";
import { useTranslation } from "next-i18next";
import colors from "../../styles/colors";
import SentenceReportSummary from "./SentenceReportSummary";
import ClassificationText from "../ClassificationText";
import LocalizedDate from "../LocalizedDate";

const { Title, Paragraph } = Typography;

const SentenceReportCard = ({ claim, personality, date, context, sentence, claimType = 'speech'} : { personality: any; claim: any; sentence: any; date: any; claimType: string; context: any; }) => {
    const { t } = useTranslation();
    const speechTypeTranslation =
        claimType === 'speech'
            ? t('claim:typeSpeech')
            : t('claim:typeTwitter')

    return (
        <Row> 
            <Row gutter={40} style={{paddingTop: "116px", marginBottom: "21px"}}>
                <Col span={6} style={{ textAlign: "center"}}>
                    <div>
                        <Avatar
                            size={110}
                            src={personality.image}
                            alt={t('seo:personalityImageAlt', { name: personality.name })}
                        />
                    </div>
                    <Title style={{ fontSize: "16px", marginBottom: 0, marginTop: "3px"}}>
                        {personality.name}
                    </Title>
                    <Paragraph
                        style={{
                            fontSize: "10px",
                        }}
                    >
                        {personality.description}
                        <br></br>
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
                <Col span={18}>
                    <SentenceReportSummary>
                        <Paragraph
                            ellipsis={{
                                rows: 3,
                                expandable: false
                            }}
                        >
                            <cite style={{ fontStyle: "normal" }}>
                                <p
                                    style={{
                                        fontSize: 22,
                                        color: colors.blackPrimary,
                                        fontWeight: 400,
                                        margin: 0,
                                        lineHeight: 1.5715,
                                }}>
                                    {sentence?.content}
                                </p>
                            </cite>
                            <a
                                href={`/personality/${personality.slug}/claim/${claim.slug}`}
                                style={{
                                    textDecoration: "underline",
                                    color: colors.blackPrimary,
                                    fontWeight: "bold",
                                    fontSize: "22px"
                                }}
                            >
                                {t("claim:cardLinkToFullText")}
                            </a>
                        </Paragraph>
                    </SentenceReportSummary>
                    <div style={{ display: "flex", width: "100%", justifyContent: "center", marginTop: "18px", fontSize: "22px", fontWeight: 800 }}>
                        <p style={{ marginBottom: 0 }}>
                            {t("claimReview:claimReview")}&nbsp;
                        </p>
                        <ClassificationText
                            classification={
                                context.classification
                            }
                        />
                    </div>
                </Col>
                <Col span={24}>
                    <Title level={3} style={{
                        fontSize: 10,
                        fontWeight: 400,
                        lineHeight: '15px',
                        marginBottom: 21,
                        marginTop: 68
                    }}>
                        {t('claim:cardHeader1')}&nbsp;
                        <LocalizedDate date={date} />&nbsp;
                        {t('claim:cardHeader2')}&nbsp;
                        <strong>{speechTypeTranslation}</strong>
                    </Title>
                </Col>
            </Row>
        </Row>
    );
} 

export default SentenceReportCard;