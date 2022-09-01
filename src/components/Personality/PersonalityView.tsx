import { Col, Row } from "antd";
import { useTranslation } from "next-i18next";

import { useAppSelector } from "../../store/store";
import ClaimList from "../Claim/ClaimList";
import AffixButton from "../AffixButton/AffixButton";
import Loading from "../Loading";
import MetricsOverview from "../Metrics/MetricsOverview";
import Seo from "../Seo";
import MorePersonalities from "./MorePersonalities";
import PersonalityCard from "./PersonalityCard";

const PersonalityView = ({ personality, href, personalities }) => {
    const { isLoggedIn } = useAppSelector((state) => ({
        isLoggedIn: state.login,
    }));
    const { t } = useTranslation();
    if (!personality) {
        return <Loading />;
    }

    return (
        <>
            <Seo
                title={personality.name}
                description={t("seo:personalityDescription", {
                    name: personality.name,
                })}
                openGraph={{
                    url: href,
                }}
            />
            <Row justify="center">
                <Col sm={22} md={20} lg={18}>
                    <PersonalityCard personality={personality} header={true} />
                </Col>
            </Row>

            <Row justify="center" style={{ marginTop: "64px" }}>
                <Col sm={22} md={14} lg={12}>
                    <ClaimList personality={personality} />
                </Col>
                <Col sm={22} md={8} lg={6} style={{ width: "100%" }}>
                    <MetricsOverview stats={personality.stats} />
                </Col>
            </Row>

            <MorePersonalities
                personalities={personalities}
                href={href}
                title={t("personality:otherPersonalitiesTitle")}
            />

            {isLoggedIn && <AffixButton personalitySlug={personality.slug} />}
        </>
    );
};

export default PersonalityView;
