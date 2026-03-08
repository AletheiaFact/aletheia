import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import copilotApi from "../../../api/copilotApi";

export interface CopilotSessionSummary {
    _id: string;
    claimReviewDataHash: string;
    title?: string;
    status?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface UseCopilotSessionsReturn {
    sessions: CopilotSessionSummary[];
    isLoading: boolean;
    total: number;
    page: number;
    refresh: () => Promise<void>;
    loadMore: () => Promise<void>;
}

export function useCopilotSessions(
    dataHash?: string,
    pageSize: number = 20
): UseCopilotSessionsReturn {
    const [sessions, setSessions] = useState<CopilotSessionSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);

    const fetchSessions = useCallback(
        async (pageNum: number = 1) => {
            try {
                setIsLoading(true);
                const data = await copilotApi.listSessions(
                    pageNum,
                    pageSize,
                    dataHash
                );
                if (pageNum === 1) {
                    setSessions(data.sessions);
                } else {
                    setSessions((prev) => [...prev, ...data.sessions]);
                }
                setTotal(data.total);
                setPage(pageNum);
            } catch (error) {
                if (
                    !axios.isAxiosError(error) ||
                    error.response?.status !== 403
                ) {
                    console.error("Failed to fetch sessions:", error);
                }
            } finally {
                setIsLoading(false);
            }
        },
        [pageSize, dataHash]
    );

    useEffect(() => {
        fetchSessions(1);
    }, [fetchSessions]);

    const refresh = useCallback(async () => {
        await fetchSessions(1);
    }, [fetchSessions]);

    const loadMore = useCallback(async () => {
        if (sessions.length < total) {
            await fetchSessions(page + 1);
        }
    }, [fetchSessions, page, sessions.length, total]);

    return { sessions, isLoading, total, page, refresh, loadMore };
}
