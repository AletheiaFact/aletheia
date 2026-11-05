import { MessageManager } from "../components/Messages";
import type { TranslationFn } from "../types/ApiResponse";
import { createApiInstance } from "./apiFactory";

const request = createApiInstance("/api/claim/debate");

export type TranscriptTurnStatus = "draft" | "approved" | "rejected";

export interface TranscriptTurn {
    _id: string;
    personality: string;
    text: string;
    status: TranscriptTurnStatus;
    externalId?: string;
    startedAt?: string;
    // Transcriber's 0-100 triage score; absent when it sent none.
    checkability?: number | null;
    createdAt: string;
}

export interface ReviewedTranscriptTurn {
    turnId: string;
    speechId: string;
    status: TranscriptTurnStatus;
}

const showError = (err, t: TranslationFn, fallbackKey: string) => {
    const message = err?.response?.data?.message;
    MessageManager.showMessage(
        "error",
        typeof message === "string" ? message : t(fallbackKey)
    );
    throw err;
};

const listTurns = (
    debateId: string,
    status?: TranscriptTurnStatus
): Promise<TranscriptTurn[]> => {
    return request
        .get(`/${debateId}/transcript-turns`, { params: { status } })
        .then((response) => response.data);
};

const editTurn = (
    debateId: string,
    turnId: string,
    body: { text?: string; personality?: string },
    t: TranslationFn
) => {
    return request
        .patch(`/${debateId}/transcript-turns/${turnId}`, body)
        .then((response) => response.data)
        .catch((err) => showError(err, t, "debates:draftEditError"));
};

const reviewTurns = (
    debateId: string,
    turnIds: string[],
    action: "approve" | "reject",
    t: TranslationFn
): Promise<ReviewedTranscriptTurn[]> => {
    return request
        .post(`/${debateId}/transcript-turns/${action}`, { turnIds })
        .then((response) => response.data.turns)
        .catch((err) => showError(err, t, "debates:draftReviewError"));
};

const debateTranscriptApi = {
    listTurns,
    editTurn,
    reviewTurns,
};

export default debateTranscriptApi;
