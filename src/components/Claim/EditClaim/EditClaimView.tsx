import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    Stack,
    Typography,
} from "@mui/material";
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

interface Props {
    claimId: string;
}

const EditClaimView: React.FC<Props> = ({ claimId }) => {
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
            const v = await adminClaimEditorApi.getEditableView(claimId);
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
                payload
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

    return (
        <Box>
            <Typography variant="h5" sx={{ p: 2 }}>
                {t("page.title")}
            </Typography>
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
            <Stack direction="row" spacing={2} sx={{ p: 2 }}>
                <Button
                    variant="contained"
                    onClick={submit}
                    disabled={state.matches("committing")}
                >
                    {t("actions.submit")}
                </Button>
                <Button onClick={() => setShowDiscard(true)}>
                    {t("actions.discard")}
                </Button>
            </Stack>
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
