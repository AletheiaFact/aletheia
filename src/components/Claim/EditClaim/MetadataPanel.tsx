import React from "react";
import {
    Box,
    Chip,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import {
    CalendarToday,
    DescriptionOutlined,
    InfoOutlined,
    PersonOutline,
} from "@mui/icons-material";
import { useTranslation } from "next-i18next";
import CardBase from "../../CardBase";
import colors from "../../../styles/colors";
import { PersonalityRef } from "../../../api/adminClaimEditorApi";

interface Props {
    title: string;
    date: string;
    personalities: PersonalityRef[];
    onTitleChange: (v: string) => void;
    onDateChange: (v: string) => void;
}

const SectionHeader: React.FC<{ title: string; description: string }> = ({
    title,
    description,
}) => (
    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
        <Box
            sx={{
                width: 36,
                height: 36,
                borderRadius: "8px",
                background: colors.lightTertiary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: colors.primary,
            }}
        >
            <DescriptionOutlined fontSize="small" />
        </Box>
        <Box>
            <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, lineHeight: 1.2 }}
            >
                {title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
                {description}
            </Typography>
        </Box>
    </Stack>
);

const FieldLabel: React.FC<{
    children: React.ReactNode;
    icon?: React.ReactNode;
    required?: boolean;
    tooltip?: string;
}> = ({ children, icon, required, tooltip }) => (
    <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.75 }}>
        {icon}
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {children}
            {required && (
                <Box component="span" sx={{ color: colors.error, ml: 0.25 }}>
                    *
                </Box>
            )}
        </Typography>
        {tooltip && (
            <Tooltip title={tooltip}>
                <InfoOutlined
                    sx={{
                        fontSize: 14,
                        color: colors.neutralSecondary,
                        cursor: "help",
                    }}
                />
            </Tooltip>
        )}
    </Stack>
);

const MetadataPanel: React.FC<Props> = ({
    title,
    date,
    personalities,
    onTitleChange,
    onDateChange,
}) => {
    const { t } = useTranslation("admin-editor");
    return (
        <CardBase style={{ marginBottom: 24 }}>
            <Box sx={{ p: 3, width: "100%" }}>
                <SectionHeader
                    title={t("metadata.section")}
                    description={t("metadata.description")}
                />
                <Stack spacing={2.5}>
                    <Box>
                        <FieldLabel required>{t("metadata.title")}</FieldLabel>
                        <TextField
                            value={title}
                            onChange={(e) => onTitleChange(e.target.value)}
                            fullWidth
                            size="small"
                            required
                        />
                    </Box>
                    <Box>
                        <FieldLabel
                            icon={
                                <CalendarToday
                                    sx={{
                                        fontSize: 14,
                                        color: colors.neutralSecondary,
                                    }}
                                />
                            }
                        >
                            {t("metadata.date")}
                        </FieldLabel>
                        <TextField
                            type="datetime-local"
                            value={date.slice(0, 16)}
                            onChange={(e) =>
                                onDateChange(
                                    new Date(e.target.value).toISOString()
                                )
                            }
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            size="small"
                        />
                    </Box>
                    <Box>
                        <FieldLabel
                            icon={
                                <PersonOutline
                                    sx={{
                                        fontSize: 16,
                                        color: colors.neutralSecondary,
                                    }}
                                />
                            }
                            tooltip={t("metadata.personalitiesReadOnlyTooltip")}
                        >
                            {t("metadata.personalitiesReadOnly")}
                        </FieldLabel>
                        <Stack
                            direction="row"
                            spacing={1}
                            flexWrap="wrap"
                            useFlexGap
                        >
                            {personalities.map((p) => (
                                <Tooltip key={p._id} title={p._id}>
                                    <Chip
                                        label={p.name || p._id}
                                        size="small"
                                        sx={{ fontWeight: 500 }}
                                    />
                                </Tooltip>
                            ))}
                        </Stack>
                    </Box>
                </Stack>
            </Box>
        </CardBase>
    );
};

export default MetadataPanel;
