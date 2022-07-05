import { Col, Row, Spin } from "antd";
import { useTranslation } from "next-i18next";
import { NextSeo } from "next-seo";

import ClaimList from "../Claim/ClaimList";
import AffixButton from "../Form/AffixButton";
import HomeContent from "../Home/HomeContent";
import MetricsOverview from "../Metrics/MetricsOverview";
import PersonalityCard from "./PersonalityCard";

const PersonalityView = ({ personality, href, isLoggedIn, personalities }) => {
    const { t } = useTranslation();
    if (!personality) {
        return (
            <Spin
                tip={t("global:loading")}
                style={{
                    textAlign: "center",
                    position: "absolute",
                    top: "50%",
                    left: "calc(50% - 40px)",
                }}
            ></Spin>
        );
    }

    return (
        <>
            <NextSeo
                title={personality.name}
                description={t("seo:personalityDescription", {
                    name: personality.name,
                })}
                openGraph={{
                    url: href,
                }}
            />
            <Row justify="center">
                <Col sm={24} md={18}>
                    <PersonalityCard personality={personality} header={true} />
                </Col>
            </Row>

            <Row justify="center">
                <Col sm={24} md={14} lg={12}>
                    <ClaimList personality={personality} />
                </Col>
                <Col sm={24} md={8} lg={6}>
                    <MetricsOverview stats={personality.stats} />
                </Col>
            </Row>

            <Row>
                <HomeContent
                    isLoggedIn={isLoggedIn}
                    personalities={personalities}
                    href={href}
                    title={t("personality:otherPersonalitiesTitle")}
                />
            </Row>
            {isLoggedIn && (
                <AffixButton
                    tooltipTitle={t("personality:affixButtonTitle")}
                    href={`/personality/${personality.slug}/claim/create`}
                />
            )}
        </>
    );
};

export default PersonalityView;
