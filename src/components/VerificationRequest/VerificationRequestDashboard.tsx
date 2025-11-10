import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Grid, Typography, CircularProgress } from "@mui/material";
import { Description, CheckCircle, Schedule, HourglassEmpty } from "@mui/icons-material";
import styled from "styled-components";
import colors from "../../styles/colors";
import { useTranslation } from "next-i18next";
import verificationRequestApi from "../../api/verificationRequestApi";

const Dashboard = styled(Grid)`
    padding: 24px;
    background-color: ${colors.lightNeutral};
`;

const Title = styled(Typography)`
    font-size: 24px;
    font-weight: 600;
    color: ${colors.primary};
`;

const Subtitle = styled(Typography)`
    font-size: 14px;
    color: ${colors.neutralSecondary};
    margin-top: 4px;
`;

const StatsCard = styled(Card)`
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }
`;

const StatsCardContent = styled(CardContent)`
    padding: 24px !important;
`;

const StatsHeader = styled(Box)`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
`;

const StatsIconWrapper = styled(Box)`
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${colors.neutralSecondary};
`;

const StatsValue = styled(Typography)`
    font-size: 36px;
    font-weight: 700;
    color: ${colors.primary};
    margin-bottom: 8px;
`;

const StatsLabel = styled(Typography)`
    font-size: 14px;
    color: ${colors.neutralSecondary};
    margin-bottom: 8px;
`;

const StatsChange = styled(Typography)<{ positive?: boolean }>`
    font-size: 12px;
    color: ${(props) => (props.positive ? colors.active : colors.error)};
    font-weight: 500;
`;

const ChartCard = styled(Card)`
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    min-height: 400px;
`;

const ChartCardContent = styled(CardContent)`
    padding: 24px !important;
`;

const ChartTitle = styled(Typography)`
    font-size: 18px;
    font-weight: 600;
    color: ${colors.primary};
    margin-bottom: 8px;
`;

const ChartSubtitle = styled(Typography)`
    font-size: 14px;
    color: ${colors.neutralSecondary};
    margin-bottom: 24px;
`;

const PieChartContainer = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 0;
    position: relative;
`;

const PieChartSVG = styled.svg`
    transform: rotate(-90deg);
`;

const LegendContainer = styled(Box)`
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 24px;
`;

const LegendItem = styled(Box)`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const LegendColor = styled(Box)<{ color: string }>`
    width: 12px;
    height: 12px;
    border-radius: 2px;
    background-color: ${(props) => props.color};
`;

const LegendLabel = styled(Typography)`
    font-size: 14px;
    color: ${colors.neutral};
`;

const LegendPercentage = styled(Typography)`
    font-size: 14px;
    color: ${colors.neutralSecondary};
    margin-left: 4px;
`;

const BarChartContainer = styled(Box)`
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    padding: 40px 20px;
    height: 300px;
`;

const BarWrapper = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    max-width: 120px;
`;

const Bar = styled(Box)<{ height: number; color: string }>`
    width: 80px;
    height: ${(props) => props.height}%;
    background-color: ${(props) => props.color};
    border-radius: 8px 8px 0 0;
    transition: height 0.3s ease;
    position: relative;

    &:hover {
        opacity: 0.8;
    }
`;

const BarValue = styled(Typography)`
    font-size: 18px;
    font-weight: 600;
    color: ${colors.primary};
    margin-bottom: 8px;
`;

const BarLabel = styled(Typography)`
    font-size: 12px;
    color: ${colors.neutralSecondary};
    text-align: center;
    margin-top: 12px;
`;

const ActivityCard = styled(Card)`
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ActivityCardContent = styled(CardContent)`
    padding: 24px !important;
`;

const ActivityItem = styled(Box)`
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid ${colors.lightNeutralSecondary};

    &:last-child {
        border-bottom: none;
    }
`;

const ActivityBadge = styled(Typography)<{ backgroundColor: string }>`
    padding: 2px 6px;
    border-radius: 4px;
    background-color: ${(props) => props.color};
    color: ${colors.white};
    text-transform: uppercase;
`;

const ActivityText = styled(Typography)`
    font-size: 14px;
    color: ${colors.neutral};
    flex: 1;
`;

const ActivityTime = styled(Typography)`
    font-size: 12px;
    color: ${colors.neutralSecondary};
    white-space: nowrap;
`;

interface VerificationRequestStats {
    total: number;
    verified: number;
    inAnalysis: number;
    pending: number;
    totalChange: string;
    verifiedChange: string;
    inAnalysisChange: string;
    pendingChange: string;
    sourceChannels: {
        label: string;
        value: number;
        percentage: number;
    }[];
    statusDistribution: {
        verified: number;
        inAnalysis: number;
        pending: number;
    };
    recentActivity: {
        id: string;
        status: string;
        message: string;
        timestamp: string;
    }[];
}

export const VerificationRequestDashboard: React.FC = () => {
    const { t } = useTranslation("verificationRequest");
    const [stats, setStats] = useState<VerificationRequestStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const data = await verificationRequestApi.getVerificationRequestStats();
            setStats(data);
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!stats) {
        return null;
    }

    const statsCards = [
        {
            icon: <Description />,
            label: t("dashboard.totalReports"),
            value: stats.total.toLocaleString(),
            change: stats.totalChange,
            subLabel: t("dashboard.receivedThisMonth"),
        },
        {
            icon: <CheckCircle />,
            label: t("dashboard.verified"),
            value: stats.verified.toLocaleString(),
            change: stats.verifiedChange,
            subLabel: `${((stats.verified / stats.total) * 100).toFixed(1)}% ${t("dashboard.ofTotal")}`,
        },
        {
            icon: <Schedule />,
            label: t("dashboard.inAnalysis"),
            value: stats.inAnalysis.toLocaleString(),
            change: stats.inAnalysisChange,
            subLabel: `${((stats.inAnalysis / stats.total) * 100).toFixed(1)}% ${t("dashboard.ofTotal")}`,
        },
        {
            icon: <HourglassEmpty />,
            label: t("dashboard.pending"),
            value: stats.pending.toLocaleString(),
            change: stats.pendingChange,
            subLabel: `${((stats.pending / stats.total) * 100).toFixed(1)}% ${t("dashboard.ofTotal")}`,
        },
    ];

    const sourceColors = [colors.lightPrimary, colors.secondary, colors.tertiary, colors.lightSecondary];

    // Calculate pie chart segments
    const calculatePieSegments = () => {
        let currentAngle = 0;
        return stats.sourceChannels.map((channel, index) => {
            const percentage = channel.percentage;
            const angle = (percentage / 100) * 360;
            const segment = {
                startAngle: currentAngle,
                endAngle: currentAngle + angle,
                percentage,
                color: sourceColors[index % sourceColors.length],
                label: channel.label,
            };
            currentAngle += angle;
            return segment;
        });
    };

    const createPiePath = (startAngle: number, endAngle: number) => {
        const radius = 80;
        const centerX = 100;
        const centerY = 100;

        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;

        const x1 = centerX + radius * Math.cos(startRad);
        const y1 = centerY + radius * Math.sin(startRad);
        const x2 = centerX + radius * Math.cos(endRad);
        const y2 = centerY + radius * Math.sin(endRad);

        const largeArc = endAngle - startAngle > 180 ? 1 : 0;

        return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    };

    const pieSegments = calculatePieSegments();

    const maxStatusValue = Math.max(stats.statusDistribution.verified, stats.statusDistribution.inAnalysis, stats.statusDistribution.pending);

    const statusBadgeColors: { [key: string]: string } = {
        verificada: colors.low,
        "em análise": colors.medium,
        nova: colors.neutralSecondary,
    };

    return (
        <Dashboard container spacing={2} xs={10}>
        <Grid item xs={12}>
            <Title>{t("dashboard.title")}</Title>
            <Subtitle>{t("dashboard.subtitle")}</Subtitle>
        </Grid>
        <Grid item xs={12} lg={7}>
            {/* Stats Cards */}
            <Grid container spacing={3} mb={4}>
                {statsCards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <StatsCard>
                            <StatsCardContent>
                                <StatsHeader>
                                    <StatsIconWrapper>{card.icon}</StatsIconWrapper>
                                </StatsHeader>
                                <StatsValue>{card.value}</StatsValue>
                                <StatsLabel>{card.label}</StatsLabel>
                                <StatsLabel style={{ fontSize: "12px" }}>{card.subLabel}</StatsLabel>
                            </StatsCardContent>
                        </StatsCard>
                    </Grid>
                ))}
            </Grid>

            {/* Charts Section */}
            <Grid container spacing={3} mb={4}>
                {/* Source Channels Pie Chart */}
                <Grid item xs={12} md={6}>
                    <ChartCard>
                        <ChartCardContent>
                            <ChartTitle>{t("dashboard.sourcesTitle")}</ChartTitle>
                            <ChartSubtitle>{t("dashboard.sourcesSubtitle")}</ChartSubtitle>

                            <PieChartContainer>
                                <PieChartSVG width="200" height="200" viewBox="0 0 200 200">
                                    {pieSegments.map((segment, index) => (
                                        <path
                                            key={index}
                                            d={createPiePath(segment.startAngle, segment.endAngle)}
                                            fill={segment.color}
                                            stroke={colors.white}
                                            strokeWidth="2"
                                        />
                                    ))}
                                </PieChartSVG>
                            </PieChartContainer>

                            <LegendContainer>
                                {stats.sourceChannels.map((channel, index) => (
                                    <LegendItem key={index}>
                                        <LegendColor color={sourceColors[index % sourceColors.length]} />
                                        <LegendLabel>{channel.label}</LegendLabel>
                                        <LegendPercentage>{channel.percentage.toFixed(1)}%</LegendPercentage>
                                    </LegendItem>
                                ))}
                            </LegendContainer>
                        </ChartCardContent>
                    </ChartCard>
                </Grid>

                {/* Status Distribution Bar Chart */}
                <Grid item xs={12} md={6}>
                    <ChartCard>
                        <ChartCardContent>
                            <ChartTitle>{t("dashboard.statusTitle")}</ChartTitle>
                            <ChartSubtitle>{t("dashboard.statusSubtitle")}</ChartSubtitle>

                            <BarChartContainer>
                                <BarWrapper>
                                    <BarValue>{stats.statusDistribution.verified}</BarValue>
                                    <Bar
                                        height={(stats.statusDistribution.verified / maxStatusValue) * 100}
                                        color={colors.primary}
                                    />
                                    <BarLabel>{t("dashboard.verified")}</BarLabel>
                                </BarWrapper>

                                <BarWrapper>
                                    <BarValue>{stats.statusDistribution.inAnalysis}</BarValue>
                                    <Bar
                                        height={(stats.statusDistribution.inAnalysis / maxStatusValue) * 100}
                                        color={colors.secondary}
                                    />
                                    <BarLabel>{t("dashboard.inAnalysis")}</BarLabel>
                                </BarWrapper>

                                <BarWrapper>
                                    <BarValue>{stats.statusDistribution.pending}</BarValue>
                                    <Bar
                                        height={(stats.statusDistribution.pending / maxStatusValue) * 100}
                                        color={colors.neutralSecondary}
                                    />
                                    <BarLabel>{t("dashboard.pending")}</BarLabel>
                                </BarWrapper>
                            </BarChartContainer>
                        </ChartCardContent>
                    </ChartCard>
                </Grid>
            </Grid>
        </Grid>

            {/* Recent Activity */}
            <Grid item xs={12} lg={5}>
                    <ActivityCard>
                        <ActivityCardContent>
                            <ChartTitle>{t("dashboard.activityTitle")}</ChartTitle>
                            <ChartSubtitle>{t("dashboard.activitySubtitle")}</ChartSubtitle>

                            <Box mt={2}>
                                {stats.recentActivity.map((activity) => (
                                    <ActivityItem key={activity.id}>
                                        <ActivityBadge variant="body2" backgroundColor={statusBadgeColors[activity.status.toLowerCase()] || colors.neutral}>
                                            {activity.status}
                                        </ActivityBadge>
                                        <ActivityText>{activity.message}</ActivityText>
                                        <ActivityTime>{activity.timestamp}</ActivityTime>
                                    </ActivityItem>
                                ))}
                            </Box>
                        </ActivityCardContent>
                    </ActivityCard>
        </Grid>
        </Dashboard>
    );
};

export default VerificationRequestDashboard;