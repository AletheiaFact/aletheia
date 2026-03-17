import { useState } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { currentNameSpace } from "../../../atoms/namespace";
import { useAtom } from "jotai";
import { NameSpaceEnum } from "../../../types/Namespace";
import { EventsActions, EventsState, IData, IReviewData, IVerificationRequestData, ListEventsOptions } from "../../../types/event";
import { ViewMode } from "../../FilterToggleButtons";
interface UseEventsHookReturn {
    state: EventsState;
    actions: EventsActions;
}

const useEventsHook = (): UseEventsHookReturn => {
    const router = useRouter();
    const { t } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [recaptchaString, setRecaptchaString] = useState("");
    const hasCaptcha = !!recaptchaString;
    const [viewMode, setViewMode] = useState<ViewMode>("left");

    const [eventsData, setEventsData] = useState<IData>({
        events: [],
        eventMetrics: { verificationRequests: 0, claims: 0, reviews: 0 },
        total: 0,
    });
    const [eventsQuery, setEventsQuery] = useState<ListEventsOptions>({
        page: 1,
        pageSize: 10,
        order: "asc",
        status: "all",
    });

    const [reviewData, setReviewData] = useState<IReviewData>({ items: [], total: 0 });
    const [reviewQuery, setReviewQuery] = useState<ListEventsOptions>({
        page: 1,
        pageSize: 6,
        order: "asc",
    });

    const [verificationRequestData, setVerificationRequestData] = useState<IVerificationRequestData>({ items: [], total: 0, totalPages: 0 });
    const [verificationRequestQuery, setVerificationRequestQuery] = useState<ListEventsOptions>({
        page: 1,
        pageSize: 6,
        order: "asc",
    });

    const eventHref =
        nameSpace !== NameSpaceEnum.Main ? `/${nameSpace}/event` : "/event";

    return {
        state: {
            nameSpace,
            isLoading,
            hasCaptcha,
            recaptchaString,
            eventHref,
            eventsData,
            error,
            eventsQuery,
            reviewData,
            reviewQuery,
            viewMode,
            verificationRequestData,
            verificationRequestQuery
        },
        actions: {
            setIsLoading,
            setRecaptchaString,
            t,
            router,
            setEventsData,
            setError,
            setEventsQuery,
            setReviewData,
            setReviewQuery,
            setViewMode,
            setVerificationRequestData,
            setVerificationRequestQuery
        },
    };
}

export default useEventsHook
