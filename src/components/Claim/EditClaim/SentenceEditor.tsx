import React, { useState } from "react";
import {
    Box,
    Button,
    Chip,
    IconButton,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import {
    Check,
    Close,
    DescriptionOutlined,
    Edit,
    Undo,
} from "@mui/icons-material";
import { useTranslation } from "next-i18next";
import CardBase from "../../CardBase";
import colors from "../../../styles/colors";

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
    const [openEditId, setOpenEditId] = useState<string | null>(null);
    const [workingText, setWorkingText] = useState("");

    const openEdit = (s: SentenceDraft) => {
        setOpenEditId(s.sentenceId);
        setWorkingText(s.text);
    };

    const cancelEdit = () => {
        setOpenEditId(null);
        setWorkingText("");
    };

    const saveEdit = (s: SentenceDraft) => {
        const trimmed = workingText;
        onTextChange(s.sentenceId, trimmed);
        const differs = trimmed.trim() !== s.originalText.trim();
        onIntentChange(s.sentenceId, differs ? "edit" : "noop");
        setOpenEditId(null);
        setWorkingText("");
    };

    const revertToOriginal = (s: SentenceDraft) => {
        onTextChange(s.sentenceId, s.originalText);
        onIntentChange(s.sentenceId, "noop");
    };

    return (
        <CardBase style={{ marginBottom: 24 }}>
            <Box sx={{ p: 3, width: "100%" }}>
                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    sx={{ mb: 2.5 }}
                >
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
                            {t("sentences.section")}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {t("sentences.description", {
                                count: sentences.length,
                            })}
                        </Typography>
                    </Box>
                </Stack>

                <Stack spacing={1.5}>
                    {sentences.map((s, idx) => {
                        const isEditing = openEditId === s.sentenceId;
                        const isEdited =
                            s.intent === "edit" &&
                            s.text.trim() !== s.originalText.trim();
                        return (
                            <Box
                                key={s.sentenceId}
                                sx={{
                                    position: "relative",
                                    border: `1px solid ${
                                        isEditing
                                            ? colors.lightPrimary
                                            : colors.lightNeutralSecondary
                                    }`,
                                    boxShadow: isEditing
                                        ? `0 0 0 3px ${colors.lightTertiary}`
                                        : "none",
                                    borderRadius: "8px",
                                    background: colors.white,
                                    transition:
                                        "border-color 0.15s, box-shadow 0.15s",
                                    "&:hover .sentence-actions": {
                                        opacity: 1,
                                    },
                                    "&:hover": {
                                        borderColor: isEditing
                                            ? colors.lightPrimary
                                            : colors.neutralTertiary,
                                    },
                                }}
                            >
                                {isEditing ? (
                                    <Box sx={{ p: 2 }}>
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            alignItems="center"
                                            sx={{ mb: 1.25 }}
                                        >
                                            <Chip
                                                label={`#${idx + 1}`}
                                                size="small"
                                                variant="outlined"
                                                sx={{ fontWeight: 500 }}
                                            />
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                {t("sentences.editingLabel")}
                                            </Typography>
                                        </Stack>
                                        <TextField
                                            value={workingText}
                                            onChange={(e) =>
                                                setWorkingText(e.target.value)
                                            }
                                            fullWidth
                                            multiline
                                            minRows={3}
                                            size="small"
                                            autoFocus
                                        />
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            justifyContent="flex-end"
                                            sx={{ mt: 1.5 }}
                                        >
                                            <Button
                                                size="small"
                                                onClick={cancelEdit}
                                                startIcon={
                                                    <Close fontSize="small" />
                                                }
                                                sx={{
                                                    color: colors.blackSecondary,
                                                    textTransform: "none",
                                                }}
                                            >
                                                {t("sentences.cancelEdit")}
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                onClick={() => saveEdit(s)}
                                                startIcon={
                                                    <Check fontSize="small" />
                                                }
                                                sx={{
                                                    background: colors.primary,
                                                    textTransform: "none",
                                                    "&:hover": {
                                                        background:
                                                            colors.lightPrimary,
                                                    },
                                                }}
                                            >
                                                {t("sentences.saveEdit")}
                                            </Button>
                                        </Stack>
                                    </Box>
                                ) : (
                                    <Stack
                                        direction="row"
                                        spacing={1.5}
                                        alignItems="flex-start"
                                        sx={{ p: 2 }}
                                    >
                                        <Stack
                                            direction="row"
                                            spacing={0.75}
                                            alignItems="center"
                                            sx={{ mt: 0.25, flexShrink: 0 }}
                                        >
                                            <Chip
                                                label={`#${idx + 1}`}
                                                size="small"
                                                variant="outlined"
                                                sx={{ fontWeight: 500 }}
                                            />
                                            {isEdited && (
                                                <Chip
                                                    label={t(
                                                        "sentences.editedBadge"
                                                    )}
                                                    size="small"
                                                    sx={{
                                                        background:
                                                            colors.lightTertiary,
                                                        color: colors.primary,
                                                        fontWeight: 500,
                                                    }}
                                                />
                                            )}
                                        </Stack>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                flexGrow: 1,
                                                lineHeight: 1.6,
                                                color: colors.blackTertiary,
                                            }}
                                        >
                                            {s.text || (
                                                <Box
                                                    component="span"
                                                    sx={{
                                                        fontStyle: "italic",
                                                        color: colors.neutralSecondary,
                                                    }}
                                                >
                                                    {t("sentences.empty")}
                                                </Box>
                                            )}
                                        </Typography>
                                        <Box
                                            className="sentence-actions"
                                            sx={{
                                                opacity: 0,
                                                transition: "opacity 0.15s",
                                                flexShrink: 0,
                                                display: "flex",
                                                gap: 0.5,
                                            }}
                                        >
                                            {isEdited && (
                                                <Tooltip
                                                    title={t(
                                                        "sentences.revertTooltip"
                                                    )}
                                                >
                                                    <IconButton
                                                        size="small"
                                                        aria-label={t(
                                                            "sentences.revertTooltip"
                                                        )}
                                                        onClick={() =>
                                                            revertToOriginal(s)
                                                        }
                                                    >
                                                        <Undo fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            <Tooltip
                                                title={t(
                                                    "sentences.editTooltip"
                                                )}
                                            >
                                                <IconButton
                                                    size="small"
                                                    aria-label={t(
                                                        "sentences.editTooltip"
                                                    )}
                                                    onClick={() => openEdit(s)}
                                                >
                                                    <Edit fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Stack>
                                )}
                            </Box>
                        );
                    })}
                    {sentences.length === 0 && (
                        <Box
                            sx={{
                                py: 4,
                                border: `1px dashed ${colors.lightNeutralSecondary}`,
                                borderRadius: "8px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 1,
                            }}
                        >
                            <DescriptionOutlined
                                sx={{
                                    fontSize: 32,
                                    color: colors.neutralSecondary,
                                    opacity: 0.6,
                                }}
                            />
                            <Typography variant="body2" color="text.secondary">
                                {t("sentences.empty")}
                            </Typography>
                        </Box>
                    )}
                </Stack>
            </Box>
        </CardBase>
    );
};

export default SentenceEditor;
