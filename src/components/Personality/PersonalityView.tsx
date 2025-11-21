import { Grid } from "../Grid";
import { useTranslation } from "next-i18next";

import ClaimList from "../Claim/ClaimList";
import PersonalityViewSkeleton from "../Skeleton/PersonalityViewSkeleton";
import MetricsOverview from "../Metrics/MetricsOverview";
import Seo from "../Seo";
import MorePersonalities from "./MorePersonalities";
import PersonalityCard from "./PersonalityCard";
import { spacing } from "../../styles";

const PersonalityView = ({ personality, href, personalities }) => {
    const { t } = useTranslation();
    if (!personality) {
        return <PersonalityViewSkeleton />;
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
            <Grid container justifyContent="center">
                <Grid item sm={11} md={11} lg={9}>
                    <PersonalityCard personality={personality} header={true} />
                </Grid>
            </Grid>

            <Grid container justifyContent="center" style={{ marginTop: spacing['3xl'] }}>
                <Grid item sm={11} md={7} lg={6}>
                    <ClaimList personality={personality} />
                </Grid>
                <Grid item sm={11} md={4} lg={3} style={{ width: "100%" }}>
                    <MetricsOverview stats={personality.stats} />
                </Grid>
            </Grid>

            <MorePersonalities
                personalities={personalities}
                href={href}
                title={t("personality:otherPersonalitiesTitle")}
            />
        </>
    );
};

export default PersonalityView;
