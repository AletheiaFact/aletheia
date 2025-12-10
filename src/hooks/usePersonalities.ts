import { useState, useEffect, useCallback, useRef } from "react";
import verificationRequestApi from "../api/verificationRequestApi";
import type { PersonalityWithWikidata } from "../types/PersonalityWithWikidata";

interface UsePersonalitiesParams {
    requestId: string | undefined;
    isOpen: boolean;
    hasIdentifiedData: boolean;
    language: string;
}

interface UsePersonalitiesReturn {
    personalities: PersonalityWithWikidata[];
    isLoading: boolean;
    error: Error | null;
    retry: () => void;
}

export const usePersonalities = ({
    requestId,
    isOpen,
    hasIdentifiedData,
    language,
}: UsePersonalitiesParams): UsePersonalitiesReturn => {
    const [personalities, setPersonalities] = useState<
        PersonalityWithWikidata[]
    >([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const currentRequestIdRef = useRef<string | undefined>();

    const fetchPersonalities = useCallback(async () => {
        if (!requestId || !isOpen || !hasIdentifiedData) {
            setPersonalities([]);
            setIsLoading(false);
            setError(null);
            return;
        }

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        currentRequestIdRef.current = requestId;

        setPersonalities([]);
        setIsLoading(true);
        setError(null);

        try {
            const personalitiesData =
                await verificationRequestApi.getPersonalitiesWithWikidata(
                    requestId,
                    language
                );

            if (currentRequestIdRef.current === requestId) {
                setPersonalities(personalitiesData);
                setError(null);
            }
        } catch (err) {
            if (
                currentRequestIdRef.current === requestId &&
                err instanceof Error &&
                err.name !== "AbortError"
            ) {
                console.error("Error fetching personalities:", err);
                setError(err);
                setPersonalities([]);
            }
        } finally {
            if (currentRequestIdRef.current === requestId) {
                setIsLoading(false);
            }
        }
    }, [requestId, isOpen, hasIdentifiedData, language]);

    const retry = useCallback(() => {
        fetchPersonalities();
    }, [fetchPersonalities]);

    useEffect(() => {
        fetchPersonalities();

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchPersonalities]);

    return {
        personalities,
        isLoading,
        error,
        retry,
    };
};
