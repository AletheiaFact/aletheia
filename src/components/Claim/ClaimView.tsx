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
import { useRouter } from "next/router";

const { Title } = Typography;

const Claim = ({ personality, claim, href }) => {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    moment.locale(i18n.language);

    const { content, title, stats } = claim;

    let { date } = claim;
    const body = content.object;
    date = moment(new Date(date));
    const [ showHighlights, setShowHighlights ] = useState(true);

    useEffect(() => {
        message.info(t("claim:initialInfo"));
    });

    if (body && personality) {
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
                        margin: "15px -15px 15px -15px",
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
                                {body.map(p => (
                                    <ClaimParagraph
                                        key={p.props.id}
                                        paragraph={p}
                                        showHighlights={
                                            showHighlights
                                        }
                                        onClaimReviewForm={data => {
                                            router.push(
                                                `/claim/${claim._id}/sentence/${data.properties["data-hash"]}`
                                            );
                                        }}
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
