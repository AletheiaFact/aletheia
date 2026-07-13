import Grid from "@mui/material/Grid"

import ClaimList from "../Claim/ClaimList";
import Loading from "../Loading";
import MetricsOverview from "../Metrics/MetricsOverview";
import Seo from "../Seo";
import MorePersonalities from "./MorePersonalities";
import PersonalityCard from "./PersonalityCard";
import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";

const PersonalityView = ({ personality, href, personalities }) => {
    const tPersonality = useTranslations("personality");
    const tSeo = useTranslations("seo");

    if (!personality) {
        return <Loading />;
    }

    return (
        <>
            <Seo
                title={personality.name}
                description={tSeo("personalityDescription", {
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

            <Grid container justifyContent="center" style={{ marginTop: "64px" }}>
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
                title={
                    <Typography variant="h2" fontSize={24}>
                        {tPersonality("otherPersonalitiesTitle")}
                    </Typography>
                }
            />
        </>
    );
};

export default PersonalityView;
