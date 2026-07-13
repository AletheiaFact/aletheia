import React, { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import verificationRequestApi from "../../../api/verificationRequestApi";
import {
    StatsCount,
    StatsRecentActivity,
    StatsSourceChannels,
} from "../../../types/VerificationRequest";
import { Dashboard } from "./VerificationRequestDashboard.style";
import VerificationRequestCounts from "./VerificationRequestCounts";
import VerificationRequestOverview from "./VerificationRequestOverview";
import VerificationRequestActivity from "./VerificationRequestActivity";
import Loading from "../../Loading";
import { useTranslations } from "next-intl";

const VerificationRequestDashboard: React.FC = () => {
    const tVerificationRequest = useTranslations("verificationRequest");
    const [stats, setStats] = useState<{
        statsCount: StatsCount;
        statsSourceChannels: StatsSourceChannels[];
        statsRecentActivity: StatsRecentActivity[];
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            setError(false);
            const data =
                await verificationRequestApi.getVerificationRequestStats();
            if (!data) {
                throw new Error("Empty data");
            }
            setStats(data);
        } catch (err) {
            console.error("Error fetching stats:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (error || !stats) {
        return (
            <Dashboard style={{ justifyContent: "center" }}>
                <Typography>{tVerificationRequest("dashboard.errorLoading")}</Typography>
            </Dashboard>
        );
    }

    return (
        <Dashboard>
            <Grid item xs={12} style={{ margin: "0 auto" }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography className="title">
                            {tVerificationRequest("dashboard.title")}
                        </Typography>
                        <Typography className="subtitle">
                            {tVerificationRequest("dashboard.subtitle")}
                        </Typography>
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        lg={7}
                        style={{ display: "flex", flexDirection: "column" }}
                    >
                        <VerificationRequestCounts {...stats.statsCount} />
                        <VerificationRequestOverview
                            statsCounts={stats.statsCount}
                            statsSourceChannels={stats.statsSourceChannels}
                        />
                    </Grid>

                    <Grid item xs={12} lg={5}>
                        <VerificationRequestActivity
                            statsRecentActivity={stats.statsRecentActivity}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Dashboard>
    );
};

export default VerificationRequestDashboard;
