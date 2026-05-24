import React from "react";
import { Box, Stack, TextField, Typography, Chip } from "@mui/material";
import { useTranslation } from "next-i18next";

interface Props {
    title: string;
    date: string;
    personalities: string[];
    onTitleChange: (v: string) => void;
    onDateChange: (v: string) => void;
}

const MetadataPanel: React.FC<Props> = ({
    title,
    date,
    personalities,
    onTitleChange,
    onDateChange,
}) => {
    const { t } = useTranslation("admin-editor");
    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                {t("metadata.section")}
            </Typography>
            <Stack spacing={2}>
                <TextField
                    label={t("metadata.title")}
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    fullWidth
                    required
                />
                <TextField
                    label={t("metadata.date")}
                    type="datetime-local"
                    value={date.slice(0, 16)}
                    onChange={(e) =>
                        onDateChange(new Date(e.target.value).toISOString())
                    }
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                />
                <Box>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                    >
                        {t("metadata.personalitiesReadOnly")}
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                        {personalities.map((p) => (
                            <Chip key={p} label={p} size="small" />
                        ))}
                    </Stack>
                </Box>
            </Stack>
        </Box>
    );
};

export default MetadataPanel;
