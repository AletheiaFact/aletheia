import { Card, Grid } from "@mui/material";
import { StatsSourceChannelsProps } from "../../../types/VerificationRequest";
import { SourceChannelDistribution } from "./SourceChannelDistribution";
import { StatusDistribution } from "./StatusDistribution";

const VerificationRequestOverview = ({
    statsCounts,
    statsSourceChannels,
}: StatsSourceChannelsProps) => (
    <Grid container spacing={3} style={{ flex: 1 }}>
        <Grid item xs={12} md={6}>
            <Card className="card" style={{ height: "100%" }}>
                <SourceChannelDistribution
                    statsSourceChannels={statsSourceChannels}
                />
            </Card>
        </Grid>

        <Grid item xs={12} md={6}>
            <Card className="card" style={{ height: "100%" }}>
                <StatusDistribution {...statsCounts} />
            </Card>
        </Grid>
    </Grid>
);

export default VerificationRequestOverview;
