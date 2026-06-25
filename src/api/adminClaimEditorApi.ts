import { createApiInstance } from "./apiFactory";

const request = createApiInstance("");

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

export interface PersonalityRef {
    _id: string;
    name: string;
    slug?: string;
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
        personalities: PersonalityRef[];
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

function buildBasePath(nameSpace?: string): string {
    if (nameSpace && nameSpace !== "main") {
        return `/${encodeURIComponent(nameSpace)}/api/claim`;
    }
    return "/api/claim";
}

async function getEditableView(
    claimId: string,
    nameSpace?: string
): Promise<AdminClaimEditableView> {
    const base = buildBasePath(nameSpace);
    const safeId = encodeURIComponent(claimId);
    const { data } = await request.get(`${base}/${safeId}/admin-edit/view`);
    return data;
}

async function commitEdit(
    claimId: string,
    payload: AdminClaimEditCommitRequest,
    nameSpace?: string
): Promise<AdminClaimEditCommitResponse> {
    const base = buildBasePath(nameSpace);
    const safeId = encodeURIComponent(claimId);
    const { data } = await request.post(
        `${base}/${safeId}/admin-edit/commit`,
        payload
    );
    return data;
}

export const __internal = { buildBasePath };

export default {
    getEditableView,
    commitEdit,
};
