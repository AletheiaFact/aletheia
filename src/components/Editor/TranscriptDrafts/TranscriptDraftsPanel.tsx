import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useCommands, useHelpers } from "@remirror/react";
import { useTranslation } from "next-i18next";
import {
    Box,
    Checkbox,
    FormControlLabel,
    MenuItem,
    TextField,
    Typography,
} from "@mui/material";

import debateTranscriptApi, {
    TranscriptTurn,
} from "../../../api/debateTranscriptApi";
import EditorApi from "../../../api/editor";
import { MessageManager } from "../../Messages";
import colors from "../../../styles/colors";
import AletheiaButton, { ButtonType } from "../../AletheiaButton";
import { getEditorClaimCardContentHtml } from "../EditorClaimCard/EditorClaimCard";
import CheckabilityBadge from "./CheckabilityBadge";

const POLL_INTERVAL = 5000;
// Server limit of turnIds per approve/reject request.
const MAX_TURNS_PER_REQUEST = 50;

type TurnEdit = { text: string; personality: string };

const chunk = <T,>(items: T[], size: number) =>
    Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
        items.slice(index * size, index * size + size)
    );

// Runs `step` on each item one after the other, each after the previous
// one resolved.
const runInSequence = <T,>(items: T[], step: (item: T) => Promise<void>) =>
    items.reduce<Promise<void>>(
        (previous, item) => previous.then(() => step(item)),
        Promise.resolve()
    );

interface ITranscriptDraftsPanelProps {
    debateId: string;
    editorReference: string;
    isLive: boolean;
    personalities: { _id: string; name: string }[];
}

/**
 * Draft transcript turns of the debate. A reviewer can edit the text and
 * speaker of each draft, publish it (as is or after the edit) or reject
 * it. Published speeches are added to the editor as claim cards.
 */
const TranscriptDraftsPanel = ({
    debateId,
    editorReference,
    isLive,
    personalities,
}: ITranscriptDraftsPanelProps) => {
    const { t } = useTranslation();
    const commands = useCommands();
    const { getJSON } = useHelpers();
    const [turns, setTurns] = useState<TranscriptTurn[]>([]);
    const [edits, setEdits] = useState<Record<string, TurnEdit>>({});
    const [selected, setSelected] = useState<string[]>([]);
    const [isBusy, setIsBusy] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const fetchDrafts = useCallback(
        () =>
            debateTranscriptApi
                .listTurns(debateId, "draft")
                .then((drafts) => {
                    setTurns(drafts);
                    setFetchError(null);
                })
                // Polling keeps going; the next tick retries.
                .catch((err) => {
                    const status = err?.response?.status ?? "";
                    const message = err?.response?.data?.message;
                    setFetchError(
                        `${status} ${
                            typeof message === "string"
                                ? message
                                : message?.message ?? err?.message ?? ""
                        }`.trim()
                    );
                }),
        [debateId]
    );

    useEffect(() => {
        if (!debateId) {
            return;
        }
        // fetchDrafts handles its own errors, so the promise never rejects.
        void fetchDrafts();
        if (!isLive) {
            return;
        }
        const interval = setInterval(() => void fetchDrafts(), POLL_INTERVAL);
        return () => clearInterval(interval);
    }, [debateId, isLive, fetchDrafts]);

    const turnIds = useMemo(() => turns.map((turn) => turn._id), [turns]);
    const selectedIds = selected.filter((id) => turnIds.includes(id));

    const getEdit = (turn: TranscriptTurn): TurnEdit =>
        edits[turn._id] ?? {
            text: turn.text,
            personality: String(turn.personality),
        };

    const isDirty = (turn: TranscriptTurn) => {
        const edit = edits[turn._id];
        return (
            !!edit &&
            (edit.text !== turn.text ||
                edit.personality !== String(turn.personality))
        );
    };

    const setEdit = (turn: TranscriptTurn, change: Partial<TurnEdit>) =>
        setEdits((current) => ({
            ...current,
            [turn._id]: { ...getEdit(turn), ...change },
        }));

    const discardEdits = (ids: string[]) =>
        setEdits((current) => {
            const next = { ...current };
            ids.forEach((id) => delete next[id]);
            return next;
        });

    const toggleSelected = (turnId: string) =>
        setSelected((current) =>
            current.includes(turnId)
                ? current.filter((id) => id !== turnId)
                : [...current, turnId]
        );

    // Saves the pending edit of a turn and returns its speaker.
    const saveEdit = async (turn: TranscriptTurn) => {
        const edit = getEdit(turn);
        const body: { text?: string; personality?: string } = {};
        if (edit.text !== turn.text) {
            body.text = edit.text;
        }
        if (edit.personality !== String(turn.personality)) {
            body.personality = edit.personality;
        }
        await debateTranscriptApi.editTurn(debateId, turn._id, body, t);
        discardEdits([turn._id]);
        return edit.personality;
    };

    const runAction = async (action: () => Promise<void>) => {
        setIsBusy(true);
        try {
            await action();
        } catch {
            // The api layer already showed the error message.
        } finally {
            await fetchDrafts();
            setIsBusy(false);
        }
    };

    const insertPublishedCards = (
        published: { speechId: string; personalityId: string }[]
    ) => {
        // New cards go to the top of the editor, newest first, like the
        // "add claim" buttons do.
        const html = [...published]
            .reverse()
            .map(({ speechId, personalityId }) =>
                getEditorClaimCardContentHtml({ personalityId, speechId })
            )
            .join("");
        commands.insertHtml(html, { selection: 0 });
        return EditorApi.update(editorReference, getJSON(), t);
    };

    const handleSave = (turn: TranscriptTurn) =>
        runAction(async () => {
            await saveEdit(turn);
        });

    const handlePublish = (ids: string[]) =>
        runAction(async () => {
            const toPublish = turns.filter((turn) => ids.includes(turn._id));
            // Each edit touches its own turn, so they can be saved together.
            const personalityByTurn = new Map(
                await Promise.all(
                    toPublish.map(
                        async (turn) =>
                            [
                                turn._id,
                                isDirty(turn)
                                    ? await saveEdit(turn)
                                    : String(turn.personality),
                            ] as const
                    )
                )
            );

            const published = [];
            try {
                // Batches are approved one after the other: the server
                // appends each batch to the debate as it arrives, so
                // parallel requests could mix up the speech order.
                await runInSequence(
                    chunk(ids, MAX_TURNS_PER_REQUEST),
                    async (batch) => {
                        const reviewed = await debateTranscriptApi.reviewTurns(
                            debateId,
                            batch,
                            "approve",
                            t
                        );
                        published.push(
                            ...reviewed.map(({ turnId, speechId }) => ({
                                speechId,
                                personalityId: personalityByTurn.get(turnId),
                            }))
                        );
                    }
                );
            } finally {
                // A failed batch must not drop the cards of the batches
                // that were already published.
                if (published.length) {
                    setSelected((current) =>
                        current.filter((id) => !ids.includes(id))
                    );
                    await insertPublishedCards(published);
                    MessageManager.showMessage(
                        "success",
                        t("debates:draftsPublished", {
                            count: published.length,
                        })
                    );
                }
            }
        });

    const handleReject = (ids: string[]) => {
        if (
            !window.confirm(
                t("debates:draftsRejectConfirm", { count: ids.length })
            )
        ) {
            return;
        }
        return runAction(async () => {
            // Rejected turns do not join the debate, so order is irrelevant.
            await Promise.all(
                chunk(ids, MAX_TURNS_PER_REQUEST).map((batch) =>
                    debateTranscriptApi.reviewTurns(
                        debateId,
                        batch,
                        "reject",
                        t
                    )
                )
            );
            discardEdits(ids);
            setSelected((current) => current.filter((id) => !ids.includes(id)));
        });
    };

    if (fetchError && !turns.length) {
        return (
            <Typography color="error" sx={{ margin: "16px 0" }}>
                {t("debates:draftsFetchError")} ({fetchError})
            </Typography>
        );
    }

    if (!turns.length) {
        return null;
    }

    const allSelected = selectedIds.length === turns.length;

    return (
        <Box
            data-cy="transcriptDraftsPanel"
            sx={{
                border: `1px solid ${colors.neutralTertiary}`,
                borderRadius: "8px",
                padding: "16px",
                margin: "16px 0",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "8px",
                    marginBottom: "8px",
                }}
            >
                <Typography variant="h6">
                    {t("debates:draftsTitle", { count: turns.length })}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={allSelected}
                                indeterminate={
                                    !!selectedIds.length && !allSelected
                                }
                                onChange={() =>
                                    setSelected(allSelected ? [] : turnIds)
                                }
                            />
                        }
                        label={t("debates:draftsSelectAll")}
                    />
                    <AletheiaButton
                        type={ButtonType.primary}
                        onClick={() => handlePublish(selectedIds)}
                        disabled={isBusy || !selectedIds.length}
                        loading={isBusy}
                        data-cy="publishSelectedDrafts"
                    >
                        {t("debates:draftsPublishSelected")}
                    </AletheiaButton>
                    <AletheiaButton
                        type={ButtonType.error}
                        onClick={() => handleReject(selectedIds)}
                        disabled={isBusy || !selectedIds.length}
                    >
                        {t("debates:draftsRejectSelected")}
                    </AletheiaButton>
                </Box>
            </Box>

            {turns.map((turn) => {
                const edit = getEdit(turn);
                const dirty = isDirty(turn);
                return (
                    <Box
                        key={turn._id}
                        data-cy="transcriptDraft"
                        sx={{
                            display: "flex",
                            gap: "8px",
                            padding: "12px 0",
                            borderTop: `1px solid ${colors.neutralTertiary}`,
                        }}
                    >
                        <Checkbox
                            checked={selectedIds.includes(turn._id)}
                            onChange={() => toggleSelected(turn._id)}
                            disabled={isBusy}
                        />
                        <Box
                            sx={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <TextField
                                    select
                                    size="small"
                                    label={t("debates:draftSpeakerLabel")}
                                    value={edit.personality}
                                    onChange={(event) =>
                                        setEdit(turn, {
                                            personality: event.target.value,
                                        })
                                    }
                                    disabled={isBusy}
                                    sx={{ flex: "1 1 200px", maxWidth: "300px" }}
                                >
                                    {personalities.map((personality) => (
                                        <MenuItem
                                            key={personality._id}
                                            value={personality._id}
                                        >
                                            {personality.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <CheckabilityBadge
                                    checkability={turn.checkability}
                                />
                            </Box>
                            <TextField
                                multiline
                                minRows={2}
                                value={edit.text}
                                onChange={(event) =>
                                    setEdit(turn, { text: event.target.value })
                                }
                                disabled={isBusy}
                                error={!edit.text.trim()}
                                helperText={
                                    dirty
                                        ? t("debates:draftUnsavedLabel")
                                        : undefined
                                }
                                data-cy="transcriptDraftText"
                            />
                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "8px",
                                }}
                            >
                                <AletheiaButton
                                    type={ButtonType.primary}
                                    onClick={() => handlePublish([turn._id])}
                                    disabled={isBusy || !edit.text.trim()}
                                    data-cy="publishDraft"
                                >
                                    {t(
                                        dirty
                                            ? "debates:draftSaveAndPublish"
                                            : "debates:draftPublish"
                                    )}
                                </AletheiaButton>
                                {dirty && (
                                    <>
                                        <AletheiaButton
                                            type={ButtonType.outline}
                                            onClick={() => handleSave(turn)}
                                            disabled={
                                                isBusy || !edit.text.trim()
                                            }
                                        >
                                            {t("debates:draftSaveEdit")}
                                        </AletheiaButton>
                                        <AletheiaButton
                                            type={ButtonType.text}
                                            onClick={() =>
                                                discardEdits([turn._id])
                                            }
                                            disabled={isBusy}
                                        >
                                            {t("debates:draftDiscardEdit")}
                                        </AletheiaButton>
                                    </>
                                )}
                                <AletheiaButton
                                    type={ButtonType.error}
                                    onClick={() => handleReject([turn._id])}
                                    disabled={isBusy}
                                >
                                    {t("debates:draftReject")}
                                </AletheiaButton>
                            </Box>
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
};

export default TranscriptDraftsPanel;
