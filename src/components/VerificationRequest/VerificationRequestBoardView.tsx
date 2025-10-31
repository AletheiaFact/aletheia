import React, { useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Grid,
    Paper,
} from "@mui/material";
import colors from "../../styles/colors";
import VerificationRequestDetailDrawer from "./VerificationRequestDetailDrawer";

interface VerificationRequestBoardViewProps {
    requests: any[];
    loading: boolean;
    onRequestUpdated?: () => void;
}

const VerificationRequestBoardView: React.FC<VerificationRequestBoardViewProps> = ({
    requests,
    loading,
    onRequestUpdated,
}) => {
    const { t } = useTranslation();
    const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const statuses = useMemo(
        () => [
            { key: "Pre Triage", label: t("verificationRequest:statusPreTriage") },
            { key: "In Triage", label: t("verificationRequest:statusInTriage") },
            { key: "Posted", label: t("verificationRequest:statusPosted") },
        ],
        [t]
    );

    const handleCardClick = (request: any) => {
        setSelectedRequest(request);
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
        setSelectedRequest(null);
    };

    const handleRequestUpdate = () => {
        setSelectedRequest(null);
        if (onRequestUpdated) onRequestUpdated();
    };



    const groupedRequests = useMemo(() => {
        const grouped = statuses.reduce((acc, status) => {
            acc[status.key] = [];
            return acc;
        }, {} as Record<string, any[]>);

        requests.forEach((request) => {
            const status = request.status || "Pre Triage";
            if (grouped[status]) {
                grouped[status].push(request);
            }
        });

        return grouped;
    }, [requests, statuses]);

    const getSeverityColor = (severity: string) => {
        if (!severity) return colors.neutralSecondary;
        const lowerSeverity = severity.toLowerCase();
        if (lowerSeverity === "critical") return "#d32f2f";
        if (lowerSeverity.startsWith("high")) return "#f57c00";
        if (lowerSeverity.startsWith("medium")) return "#fbc02d";
        if (lowerSeverity.startsWith("low")) return "#388e3c";
        return colors.neutralSecondary;
    };

    const formatSeverityLabel = (severity: string) => {
        if (!severity) return "N/A";
        const parts = severity.split("_");
        if (parts.length === 2) {
            return `${parts[0].charAt(0).toUpperCase() + parts[0].slice(1)} (${parts[1]})`;
        }
        return severity.charAt(0).toUpperCase() + severity.slice(1);
    };

    const truncateText = (text: string, maxLength: number) => {
        if (!text) return "";
        return text.length > maxLength
            ? `${text.substring(0, maxLength)}...`
            : text;
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <Box sx={{ width: "100%", p: 2 }}>
            <Grid container spacing={2}>
                {statuses.map((status) => (
                    <Grid item xs={12} sm={6} md={4} key={status.key}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                backgroundColor: colors.lightNeutralSecondary,
                                minHeight: "600px",
                                maxHeight: "80vh",
                                overflow: "auto",
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    mb: 2,
                                    fontWeight: "bold",
                                    color: colors.primary,
                                    borderBottom: `2px solid ${colors.secondary}`,
                                    pb: 1,
                                }}
                            >
                                {status.label}
                                <Chip
                                    label={groupedRequests[status.key].length}
                                    size="small"
                                    sx={{ ml: 1 }}
                                />
                            </Typography>

                            {loading ? (
                                <Typography variant="body2" color="textSecondary">
                                    {t("common:loading")}
                                </Typography>
                            ) : (
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                    {groupedRequests[status.key].map((request) => (
                                        <Card
                                            key={request._id}
                                            onClick={() => handleCardClick(request)}
                                            sx={{
                                                cursor: "pointer",
                                                transition: "all 0.2s",
                                                "&:hover": {
                                                    boxShadow: 3,
                                                    transform: "translateY(-2px)",
                                                },
                                            }}
                                        >
                                            <CardContent>
                                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                                    <Chip
                                                        label={formatSeverityLabel(request.severity)}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: getSeverityColor(request.severity),
                                                            color: "white",
                                                            fontWeight: "bold",
                                                        }}
                                                    />
                                                    <Typography variant="caption" color="textSecondary">
                                                        {formatDate(request.date)}
                                                    </Typography>
                                                </Box>

                                                <Typography
                                                    variant="body1"
                                                    sx={{ mb: 1, fontWeight: 500 }}
                                                >
                                                    {truncateText(request.content, 80)}
                                                </Typography>

                                                {request.reportType && (
                                                    <Typography variant="caption" color="textSecondary" display="block">
                                                        <strong>{t("verificationRequest:tagReportType")}:</strong>{" "}
                                                        {t(`claimForm:${request.reportType}`)}
                                                    </Typography>
                                                )}

                                                {request.impactArea?.name && (
                                                    <Typography variant="caption" color="textSecondary" display="block">
                                                        <strong>{t("verificationRequest:tagImpactArea")}:</strong>{" "}
                                                        {request.impactArea.name}
                                                    </Typography>
                                                )}

                                                {request.sourceChannel && (
                                                    <Typography variant="caption" color="textSecondary" display="block">
                                                        <strong>{t("verificationRequest:tagSourceChannel")}:</strong>{" "}
                                                        {truncateText(request.sourceChannel, 30)}
                                                    </Typography>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}

                                    {groupedRequests[status.key].length === 0 && (
                                        <Typography variant="body2" color="textSecondary" align="center">
                                            {t("verificationRequest:noRequestsInStatus")}
                                        </Typography>
                                    )}
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <VerificationRequestDetailDrawer
                verificationRequest={selectedRequest}
                open={drawerOpen}
                onClose={handleDrawerClose}
                onUpdate={handleRequestUpdate}
            />
        </Box>
    );
};

export default VerificationRequestBoardView;
