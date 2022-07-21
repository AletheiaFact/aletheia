import React, { useState, useEffect } from "react";
import ClaimParagraph from "./ClaimParagraph";
import { Row, Col, Typography, message, Spin, Affix } from "antd";
import PersonalityCard from "../Personality/PersonalityCard";
import { useTranslation } from "next-i18next";
import MetricsOverview from "../Metrics/MetricsOverview";
import ToggleSection from "../ToggleSection";
import moment from "moment";
import "moment/locale/pt";
import SocialMediaShare from "../SocialMediaShare";
import { LinkPreview } from "@dhaiwat10/react-link-preview";
import colors from "../../styles/colors";
import Link from "next/link";
import AletheiaButton, { ButtonType } from "../Button";

const { Title, Paragraph } = Typography;

const Claim = ({ personality, claim, href }) => {
    const { t, i18n } = useTranslation();
    moment.locale(i18n.language);
    const { title, stats } = claim;

    let date = claim.date;
    const paragraphs = Array.isArray(claim.content) ? claim.content : [claim.content]

    date = moment(new Date(date));
    const [showHighlights, setShowHighlights] = useState(true);

    useEffect(() => {
        message.info(t("claim:initialInfo"));
    });

    const generateHref = (data) => `/personality/${personality.slug}/claim/${claim.slug}/sentence/${data.data_hash}`;

    if (paragraphs && personality) {
        return (
            <>
                <article>
                    <PersonalityCard personality={personality} header={true} />
                    <section>
                        { date && (
                            <Row style={{ marginTop: "20px" }}>
                                <Col offset={2} span={18}>
                                    <Title
                                        level={2}
                                        style={{
                                            fontSize: 14,
                                            lineHeight: 1.5715,
                                            fontWeight: 'bold',
                                            marginBottom: 0,
                                        }}
                                    >
                                        {personality.name}
                                    </Title>
                                    <p style={{ marginBottom: 0 }}>
                                        {t("claim:info", {
                                            claimDate: date.format(
                                                "L"
                                            )
                                        })}
                                    </p>
                                </Col>
                            </Row>
                        )}
                        <Row
                            style={{
                                background: "#F5F5F5",
                                boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.15)",
                                borderRadius: "30px 30px 0px 0px",
                                margin: "15px -15px 0px -15px",
                                paddingBottom: "15px"
                            }}
                        >
                            <Row style={{ marginTop: "20px", width: "100%" }}>
                                <Col offset={2} span={18}>
                                    <Title
                                        level={2}
                                        style={{
                                            fontSize: 20,
                                            lineHeight: 1.4
                                        }} 
                                    >
                                        {title}
                                    </Title>
                                </Col>
                            </Row>
                            <Row>
                                <Col offset={2} span={18}>
                                    <cite style={{ fontStyle: "normal" }}>
                                        {paragraphs.map(paragraph => (
                                            <ClaimParagraph
                                                key={paragraph.props.id}
                                                paragraph={paragraph}
                                                showHighlights={
                                                    showHighlights
                                                }
                                                generateHref={generateHref}
                                            />
                                        ))}
                                    </cite>
                                </Col>
                            </Row>
                            <Affix
                                offsetBottom={15}
                                style={{
                                    textAlign: "center",
                                    width: "100%"
                                }}
                            >
                                <ToggleSection
                                    defaultValue={showHighlights}
                                    onChange={e => {
                                        setShowHighlights(e.target.value);
                                    }}
                                    labelTrue={t("claim:showHighlightsButton")}
                                    labelFalse={t("claim:hideHighlightsButton")}
                                />
                            </Affix>
                        </Row>
                        {claim.sources && Array.isArray(claim.sources) && claim.sources.length > 0 && <Row
                            style={{
                                background: "#F5F5F5",
                                boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.15)",
                                margin: "0px -15px 5px -15px",
                                padding: "15px"
                            }}
                        >
                            <Title
                                level={3}
                                style={{
                                    fontSize: "14px",
                                    lineHeight: "21px",
                                    color: "#111111",
                                    marginBottom: 0,
                                    paddingBottom: "15px",
                                    fontWeight: 400
                                }}
                            >
                                {t("claim:sourceSectionTitle")}
                            </Title>
                            {claim.sources && <>
                                <LinkPreview
                                    url={claim.sources[0].link}
                                    borderRadius="10px"
                                    borderColor="transparent"
                                    imageHeight="156px"
                                    secondaryTextColor="#515151"
                                    fallback={
                                        <Link href={claim.sources[0].link}>
                                            {claim.sources[0].link}
                                        </Link>
                                    }
                                    width="100%"
                                />
                                <AletheiaButton
                                    style={{
                                        width: "100%",
                                        marginTop: "21px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        paddingBottom: 0,
                                    }}
                                    type={ButtonType.blue}
                                    href={`/personality/${personality.slug}/claim/${claim.slug}/sources`}
                                    data-cy={personality.name}
                                >
                                    <Title
                                        level={4}
                                        style={{
                                            fontSize: 14,
                                            color: colors.white,
                                            fontWeight: 400,
                                            margin: 0,
                                        }}
                                    >
                                        {t('claim:seeSourcesButton')}
                                    </Title>
                                </AletheiaButton>
                            </>}
                            <Paragraph
                                style={{
                                    fontSize: "10px",
                                    display: "flex",
                                    justifyContent: "center",
                                    lineHeight: "15px",
                                    color: colors.bluePrimary,
                                    padding: "20px 30px 0px 30px",
                                    marginBottom: 0,
                                }}
                            >
                                <p style={{ marginBottom: 0, marginRight: 3 }}>
                                    {t("claim:sourceFooter")}
                                </p>
                                <a
                                    href={`mailto:${t("common:supportEmail")}`}
                                    style={{
                                        color: colors.blueSecondary
                                    }}
                                > {t("claim:sourceFooterReport")}</a>
                            </Paragraph>
                        </Row>}
                    </section>
                    {stats.total !== 0 && (
                        <MetricsOverview stats={stats} />
                    )}
                </article>
                <SocialMediaShare isLoggedIn={"isLoggedIn"} quote={personality?.name} href={href} claim={claim?.title} />
            </>
        );
    } else {
        return (
            <Spin
                tip={t("global:loading")}
                style={{
                    textAlign: "center",
                    position: "absolute",
                    top: "50%",
                    left: "calc(50% - 40px)"
                }}
            ></Spin>
        );
    }
}

export default Claim;
