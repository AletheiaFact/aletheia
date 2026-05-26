import React from "react";
import {
    Box,
    Chip,
    IconButton,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import { Edit, Undo } from "@mui/icons-material";
import { useTranslation } from "next-i18next";

export interface SentenceDraft {
    sentenceId: string;
    dataHash: string;
    originalText: string;
    text: string;
    intent: "noop" | "edit";
}

interface Props {
    sentences: SentenceDraft[];
    onTextChange: (sentenceId: string, newText: string) => void;
    onIntentChange: (sentenceId: string, intent: "noop" | "edit") => void;
}

const SentenceEditor: React.FC<Props> = ({
    sentences,
    onTextChange,
    onIntentChange,
}) => {
    const { t } = useTranslation("admin-editor");

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                {t("sentences.section")}
            </Typography>
            <Stack spacing={1.5}>
                {sentences.map((s, idx) => (
                    <Box
                        key={s.sentenceId}
                        sx={{
                            border: 1,
                            borderColor:
                                s.intent === "edit"
                                    ? "primary.main"
                                    : "divider",
                            borderRadius: 1,
                            p: 1.5,
                        }}
                    >
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ mb: 1 }}
                        >
                            <Chip label={`#${idx + 1}`} size="small" />
                            {s.intent === "edit" && (
                                <Chip
                                    color="primary"
                                    size="small"
                                    label={t("sentences.editedBadge")}
                                />
                            )}
                            <Box sx={{ flexGrow: 1 }} />
                            {s.intent === "edit" ? (
                                <Tooltip title={t("sentences.revertTooltip")}>
                                    <IconButton
                                        size="small"
                                        aria-label={t(
                                            "sentences.revertTooltip"
                                        )}
                                        onClick={() => {
                                            onTextChange(
                                                s.sentenceId,
                                                s.originalText
                                            );
                                            onIntentChange(
                                                s.sentenceId,
                                                "noop"
                                            );
                                        }}
                                    >
                                        <Undo fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            ) : (
                                <Tooltip title={t("sentences.editTooltip")}>
                                    <IconButton
                                        size="small"
                                        aria-label={t("sentences.editTooltip")}
                                        onClick={() =>
                                            onIntentChange(s.sentenceId, "edit")
                                        }
                                    >
                                        <Edit fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Stack>
                        {s.intent === "edit" ? (
                            <TextField
                                value={s.text}
                                onChange={(e) =>
                                    onTextChange(s.sentenceId, e.target.value)
                                }
                                fullWidth
                                multiline
                                minRows={2}
                                size="small"
                            />
                        ) : (
                            <Typography variant="body2">{s.text}</Typography>
                        )}
                    </Box>
                ))}
                {sentences.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                        {t("sentences.empty")}
                    </Typography>
                )}
            </Stack>
        </Box>
    );
};

export default SentenceEditor;
