import { createApiInstance } from "./apiFactory";

const request = createApiInstance("/api/claim");

export type SentenceOpIntent = "noop" | "edit";

export interface SentenceOp {
    intent: SentenceOpIntent;
    sourceSentenceId: string;
    newText?: string;
}

export interface AdminClaimEditMetadata {
    title?: string;
    date?: string;
    sources?: { url: string; description?: string }[];
}

export interface AdminClaimEditableView {
    claimId: string;
    claimSlug: string;
    nameSpace: string;
    personalitySlug?: string;
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

export interface AdminClaimEditCommitRequest {
    baseRevisionId: string;
    metadata?: AdminClaimEditMetadata;
    sentenceOps: SentenceOp[];
}

export interface AdminClaimEditCommitResponse {
    newRevisionId: string;
    newSlug: string;
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
    commitEdit,
};
