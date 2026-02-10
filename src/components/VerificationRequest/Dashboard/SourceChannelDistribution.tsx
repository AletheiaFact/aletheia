import { Box, Typography } from "@mui/material";
import { LegendColor, PieChartSVG } from "./VerificationRequestDashboard.style";
import colors from "../../../styles/colors";
import { VerificationRequestSourceChannel } from "../../../../server/verification-request/dto/types";
import { useTranslation } from "next-i18next";
import { StatsSourceChannelsProps } from "../../../types/VerificationRequest";

const SourceChannelDistribution = ({
    statsSourceChannels,
}: StatsSourceChannelsProps) => {
    const { t } = useTranslation("verificationRequest");

    const sourceColors = {
        [VerificationRequestSourceChannel.Whatsapp]: colors.lightPrimary,
        [VerificationRequestSourceChannel.Instagram]: colors.secondary,
        [VerificationRequestSourceChannel.Website]: colors.tertiary,
        [VerificationRequestSourceChannel.AutomatedMonitoring]:
            colors.lightSecondary,
    };

    const calculatePieSegments = () => {
        let currentAngle = 0;
        return statsSourceChannels.map((channel) => {
            const percentage = channel.percentage;
            const angle = (percentage / 100) * 360;
            const segment = {
                startAngle: currentAngle,
                endAngle: currentAngle + angle,
                percentage,
                color: sourceColors[channel.label],
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

        const clampedEnd =
            endAngle - startAngle >= 360 ? startAngle + 359.99 : endAngle;
        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (clampedEnd * Math.PI) / 180;

        const x1 = centerX + radius * Math.cos(startRad);
        const y1 = centerY + radius * Math.sin(startRad);
        const x2 = centerX + radius * Math.cos(endRad);
        const y2 = centerY + radius * Math.sin(endRad);

        const largeArc = clampedEnd - startAngle > 180 ? 1 : 0;

        return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    };

    const pieSegments = calculatePieSegments();

    return (
        <>
            <Typography className="title">
                {t("dashboard.sourcesTitle")}
            </Typography>
            <Typography className="subtitle">
                {t("dashboard.sourcesSubtitle")}
            </Typography>
            <Box className="PieChart-container">
                <PieChartSVG width="200" height="200" viewBox="0 0 200 200">
                    {pieSegments.map((segment) => (
                        <path
                            key={segment.label}
                            d={createPiePath(
                                segment.startAngle,
                                segment.endAngle
                            )}
                            fill={segment.color}
                            stroke={colors.white}
                            strokeWidth="2"
                        />
                    ))}
                </PieChartSVG>
            </Box>

            <Box className="legend">
                {statsSourceChannels.map((channel) => (
                    <Box className="legend-item" key={channel.label}>
                        <LegendColor color={sourceColors[channel.label]} />
                        <Typography className="legend-label">
                            {t(`verificationRequest:${channel.label}`, {
                                defaultValue:
                                    channel.label.charAt(0).toUpperCase() +
                                    channel.label.slice(1),
                            })}
                        </Typography>
                        <Typography className="legend-percentage">
                            {channel.percentage.toFixed(1)}%
                        </Typography>
                    </Box>
                ))}
            </Box>
        </>
    );
};

export { SourceChannelDistribution };
