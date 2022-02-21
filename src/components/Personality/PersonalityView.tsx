import { useState }  from "react";
import { useRouter } from "next/router";
import {
    Row,
    Spin
} from "antd";
import PersonalityCard from "./PersonalityCard";
import SocialMediaShare from "../SocialMediaShare";
import AffixButton from "../Form/AffixButton";
import ToggleSection from "../ToggleSection"
import ClaimList from "../Claim/ClaimList";
import MetricsOverview from "../Metrics/MetricsOverview";
import { useTranslation } from 'next-i18next';

const PersonalityView = ({ personality, href }) => {
    const { t, i18n } = useTranslation();

    const [showSpeechesSection, setShowSpeechesSection] = useState(true);

    const onSectionChange = (event) => {
        setShowSpeechesSection(event.target.value);
    }

    if (!personality) {
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

    return (
        <>
            <PersonalityCard personality={personality} header={true} />
            <br />
            <AffixButton
                tooltipTitle={t("personality:affixButtonTitle")}
                href={`/personality/${personality.slug}/claim/create`}
            />
            <Row
                style={{
                    textAlign: "center",
                    width: "100%"
                }}
            >
                <ToggleSection
                    defaultValue={showSpeechesSection}
                    labelTrue={t("personality:toggleSectionSpeeches")}
                    labelFalse={t("metrics:headerTitle")}
                    onChange={onSectionChange}
                ></ToggleSection>
            </Row>
            {showSpeechesSection ? (
                <ClaimList personality={personality}></ClaimList>
            ) : (
                <MetricsOverview stats={personality.stats} />
            )}
            <SocialMediaShare href={href} quote={personality.name} />
        </>
    );
}

export default PersonalityView;
