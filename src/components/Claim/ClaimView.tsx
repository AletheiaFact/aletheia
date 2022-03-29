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
import { LinkPreview } from '@dhaiwat10/react-link-preview';
import colors from "../../styles/colors";

const { Title } = Typography;

const Claim = ({ personality, claim, href }) => {
    const { t, i18n } = useTranslation();
    moment.locale(i18n.language);
    const { title, stats } = claim;

    let date = claim.date;
    const paragraphs = claim.content.object;

    date = moment(new Date(date));
    const [ showHighlights, setShowHighlights ] = useState(true);

    useEffect(() => {
        message.info(t("claim:initialInfo"));
    });

    const generateHref = (data) => `/personality/${personality.slug}/claim/${claim.slug}/sentence/${data.properties["data-hash"]}`;

    if (paragraphs && personality) {
        return (
            <>
                <PersonalityCard personality={personality} header={true} />
                {date && (
                    <Row style={{ marginTop: "20px" }}>
                        <Col offset={2} span={18}>
                            <b>{personality.name}</b>
                            <br />
                            {t("claim:info", {
                                claimDate: date.format(
                                    "L"
                                )
                            })}
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
                            <Title level={4}>{title}</Title>
                        </Col>
                    </Row>
                    <Row>
                        <Col offset={2} span={18}>
                            <div>
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
                            </div>
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
                    <div
                        style={{
                            fontSize: "14px",
                            lineHeight: "21px",
                            color: "#111111",
                            paddingBottom: "15px"
                        }}
                    >
                        {t("claim:sourceSectionTitle")}
                    </div>
                    {claim.sources && claim.sources.map(
                        (source) => <LinkPreview
                            url={source.link}
                            borderRadius="10px"
                            borderColor="transparent"
                            imageHeight="156px"
                            secondaryTextColor="#515151"
                            width="100%"
                        />
                    )}
                    <span
                        style={{
                            fontSize: "10px",
                            lineHeight: "15px",
                            textAlign: "center",
                            color: colors.bluePrimary,
                            padding: "20px 30px 0px 30px"
                        }}
                    >
                        {t("claim:sourceFooter")}
                        <a
                            href={`mailto:${t("common:supportEmail")}`}
                            style={{
                                color: colors.blueSecondary
                            }}
                        > {t("claim:sourceFooterReport")}</a>
                    </span>
                </Row>}
                {stats.total !== 0 && (
                    <MetricsOverview stats={stats} />
                )}
                <SocialMediaShare quote={personality?.name} href={href} />
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
