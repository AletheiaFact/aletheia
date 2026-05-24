import { createApiInstance } from "./apiFactory";

const request = createApiInstance("/api/claim");

export type SentenceOpIntent =
    | "noop"
    | "edit"
    | "split"
    | "merge"
    | "insert"
    | "delete";

export interface SentenceOp {
    intent: SentenceOpIntent;
    sourceSentenceId?: string;
    sourceSentenceIds?: string[];
    newText?: string;
    newTexts?: string[];
    afterSentenceId?: string | null;
}

export interface AdminClaimEditMetadata {
    title?: string;
    date?: string;
    sources?: { url: string; description?: string }[];
}

export interface AdminClaimEditableView {
    claimId: string;
    baseRevisionId: string;
    metadata: {
        title: string;
        date: string;
        sources: { url: string; description?: string }[];
        personalities: string[];
    };
    sentences: Array<{
        sentenceId: string;
        dataHash: string;
        text: string;
        position: number;
    }>;
}

export interface AdminClaimEditPreviewRequest {
    baseRevisionId: string;
    metadata?: AdminClaimEditMetadata;
    sentenceOps: SentenceOp[];
}

export interface AdminClaimEditPreviewResponse {
    status: "ready" | "needs-resolution";
    classifiedDiff: {
        metadataChanges: Array<{ field: string; from: unknown; to: unknown }>;
        sentenceChanges: unknown[];
    };
    ambiguities: unknown[];
}

export interface AdminClaimEditCommitRequest
    extends AdminClaimEditPreviewRequest {
    resolutions?: unknown[];
}

export interface AdminClaimEditCommitResponse {
    newRevisionId: string;
    historyEntryId: string;
    sentenceHashMap: { oldDataHash: string; newDataHash: string }[];
    cascadeSummary: Record<string, number>;
}

export interface AdminClaimEditConflictError {
    statusCode: 409;
    message: string;
    currentRevisionId: string;
}

async function getEditableView(
    claimId: string
): Promise<AdminClaimEditableView> {
    const { data } = await request.get(`/${claimId}/admin-edit/view`);
    return data;
}

async function previewEdit(
    claimId: string,
    payload: AdminClaimEditPreviewRequest
): Promise<AdminClaimEditPreviewResponse> {
    const { data } = await request.post(
        `/${claimId}/admin-edit/preview`,
        payload
    );
    return data;
}

async function commitEdit(
    claimId: string,
    payload: AdminClaimEditCommitRequest
): Promise<AdminClaimEditCommitResponse> {
    const { data } = await request.post(
        `/${claimId}/admin-edit/commit`,
        payload
    );
    return data;
}

export default {
    getEditableView,
    previewEdit,
    commitEdit,
};
