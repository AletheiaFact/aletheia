import React, { useEffect, useMemo, useState } from "react";
import { Box, Chip, CircularProgress, Stack, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import { useMachine } from "@xstate/react";
import { useRouter } from "next/router";
import MetadataPanel from "./MetadataPanel";
import SentenceEditor, { SentenceDraft } from "./SentenceEditor";
import ConflictDialog from "./ConflictDialog";
import DiscardConfirmDialog from "./DiscardConfirmDialog";
import { editClaimMachine } from "../../../machines/editClaim/editClaim.machine";
import adminClaimEditorApi, {
    AdminClaimEditableView,
    SentenceOp,
} from "../../../api/adminClaimEditorApi";
import { MessageManager } from "../../Messages";
import AletheiaButton, { ButtonType } from "../../AletheiaButton";
import colors from "../../../styles/colors";

interface Props {
    claimId: string;
    nameSpace?: string;
}

const EditClaimView: React.FC<Props> = ({ claimId, nameSpace }) => {
    const { t } = useTranslation("admin-editor");
    const router = useRouter();
    const [view, setView] = useState<AdminClaimEditableView | null>(null);
    const [loading, setLoading] = useState(true);
    const [showDiscard, setShowDiscard] = useState(false);
    const [sentenceDrafts, setSentenceDrafts] = useState<SentenceDraft[]>([]);
    const [state, send] = useMachine(editClaimMachine, {
        context: { claimId, baseRevisionId: "", title: "", date: "" },
    });

    const load = async () => {
        setLoading(true);
        try {
            const v = await adminClaimEditorApi.getEditableView(
                claimId,
                nameSpace
            );
            setView(v);
            send({ type: "SET_TITLE", value: v.metadata.title });
            send({ type: "SET_DATE", value: v.metadata.date });
            setSentenceDrafts(
                v.sentences.map((s) => ({
                    sentenceId: s.sentenceId,
                    dataHash: s.dataHash,
                    originalText: s.text,
                    text: s.text,
                    intent: "noop",
                }))
            );
        } catch (e: any) {
            MessageManager.showMessage("error", t("load.error"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (claimId) void load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [claimId]);

    const buildClaimUrl = (v: AdminClaimEditableView): string => {
        const nsPrefix =
            v.nameSpace && v.nameSpace !== "main" ? `/${v.nameSpace}` : "";
        const path = v.personalitySlug
            ? `/personality/${v.personalitySlug}/claim/${v.claimSlug}`
            : `/claim/${v.claimSlug}`;
        return `${nsPrefix}${path}`;
    };

    const buildSentenceOps = (): SentenceOp[] =>
        sentenceDrafts
            .filter(
                (d) =>
                    d.intent === "edit" &&
                    d.text.trim() !== d.originalText.trim()
            )
            .map((d) => ({
                intent: "edit" as const,
                sourceSentenceId: d.sentenceId,
                newText: d.text.trim(),
            }));

    const normalizeToMinute = (iso: string | undefined): string => {
        if (!iso) return "";
        const d = new Date(iso);
        if (isNaN(d.getTime())) return iso;
        return d.toISOString().slice(0, 16);
    };

    const hasChanges = useMemo(() => {
        if (!view) return false;
        if (state.context.title !== view.metadata.title) return true;
        if (
            normalizeToMinute(state.context.date) !==
            normalizeToMinute(view.metadata.date)
        ) {
            return true;
        }
        return sentenceDrafts.some(
            (d) =>
                d.intent === "edit" && d.text.trim() !== d.originalText.trim()
        );
    }, [view, state.context.title, state.context.date, sentenceDrafts]);

    const submit = async () => {
        if (!view) return;
        const sentenceOps = buildSentenceOps();
        const payload = {
            baseRevisionId: view.baseRevisionId,
            metadata: { title: state.context.title, date: state.context.date },
            sentenceOps,
        };
        try {
            send({ type: "COMMIT" });
            const result = await adminClaimEditorApi.commitEdit(
                claimId,
                payload,
                nameSpace
            );
            send({ type: "COMMIT_OK" });
            MessageManager.showMessage("success", t("commit.success"));
            window.location.href = buildClaimUrl({
                ...view,
                claimSlug: result.newSlug,
            });
        } catch (e: any) {
            if (e?.response?.status === 409) {
                send({
                    type: "COMMIT_CONFLICT",
                    currentRevisionId: e.response.data?.currentRevisionId ?? "",
                });
                return;
            }
            const msg = e?.response?.data?.message ?? t("commit.error");
            send({ type: "COMMIT_FAIL", error: String(msg) });
            MessageManager.showMessage("error", String(msg));
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
            </Box>
        );
    }
    if (!view) return null;

    const committing = state.matches("committing");

    return (
        <Box sx={{ pb: 10 }}>
            <Box sx={{ px: { xs: 2, md: 3 }, pt: 3, pb: 2 }}>
                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    sx={{ mb: 0.5 }}
                >
                    <Typography
                        component="h1"
                        sx={{
                            fontFamily: '"Noticia Text", serif',
                            fontSize: { xs: 24, md: 28 },
                            fontWeight: 500,
                            lineHeight: 1.2,
                            color: colors.blackTertiary,
                        }}
                    >
                        {t("page.title")}
                    </Typography>
                    {hasChanges && (
                        <Chip
                            label={t("status.unsaved")}
                            size="small"
                            sx={{
                                background: colors.lightTertiary,
                                color: colors.primary,
                                fontWeight: 500,
                            }}
                        />
                    )}
                </Stack>
                <Typography variant="body2" color="text.secondary">
                    {t("page.subtitle")}
                </Typography>
            </Box>

            <Box sx={{ px: { xs: 2, md: 3 } }}>
                <MetadataPanel
                    title={state.context.title}
                    date={state.context.date}
                    personalities={view.metadata.personalities}
                    onTitleChange={(v) => send({ type: "SET_TITLE", value: v })}
                    onDateChange={(v) => send({ type: "SET_DATE", value: v })}
                />
                <SentenceEditor
                    sentences={sentenceDrafts}
                    onTextChange={(id, text) =>
                        setSentenceDrafts((prev) =>
                            prev.map((s) =>
                                s.sentenceId === id ? { ...s, text } : s
                            )
                        )
                    }
                    onIntentChange={(id, intent) =>
                        setSentenceDrafts((prev) =>
                            prev.map((s) =>
                                s.sentenceId === id ? { ...s, intent } : s
                            )
                        )
                    }
                />
            </Box>

            <Box
                sx={{
                    position: "sticky",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    borderTop: `1px solid ${colors.lightNeutralSecondary}`,
                    background: "rgba(255, 255, 255, 0.85)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    px: { xs: 2, md: 3 },
                    py: 2,
                    zIndex: 10,
                }}
            >
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    alignItems={{ xs: "stretch", sm: "center" }}
                    justifyContent="space-between"
                >
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ display: { xs: "none", sm: "block" } }}
                    >
                        {hasChanges
                            ? t("status.unsavedLong")
                            : t("status.saved")}
                    </Typography>
                    <Stack direction="row" spacing={1.5}>
                        <AletheiaButton
                            type={ButtonType.whiteBlack}
                            onClick={() => setShowDiscard(true)}
                            disabled={!hasChanges || committing}
                        >
                            {t("actions.discard")}
                        </AletheiaButton>
                        <AletheiaButton
                            type={ButtonType.blue}
                            onClick={submit}
                            disabled={!hasChanges || committing}
                        >
                            {t("actions.submit")}
                        </AletheiaButton>
                    </Stack>
                </Stack>
            </Box>

            <ConflictDialog
                open={state.matches("conflict")}
                onRefresh={() => {
                    send({ type: "REFRESH" });
                    void load();
                }}
                onDiscard={() => {
                    if (view) window.location.href = buildClaimUrl(view);
                }}
            />
            <DiscardConfirmDialog
                open={showDiscard}
                onCancel={() => setShowDiscard(false)}
                onConfirm={() => {
                    if (view) window.location.href = buildClaimUrl(view);
                }}
            />
        </Box>
    );
};

export default EditClaimView;
