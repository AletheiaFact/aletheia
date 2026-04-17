import { MessageManager } from "../components/Messages";
import { ActionTypes } from "../store/types";
import { NameSpaceEnum } from "../types/Namespace";
import type { Personality } from "../types/Personality";
import type { PaginatedResponse, TranslationFn } from "../types/ApiResponse";
import { createApiInstance } from "./apiFactory";

const request = createApiInstance("/api/personality");

interface FetchOptions {
    searchName: string;
    page?: number;
    order?: "asc" | "desc";
    pageSize?: number;
    withSuggestions?: boolean;
    fetchOnly?: boolean;
    i18n?: { languages?: any };
    headers?: { [key: string]: string };
    isHidden?: boolean;
    nameSpace?: string;
}

const getPersonalities = (
    options: FetchOptions,
    dispatch: (action: { type: ActionTypes; [key: string]: unknown }) => void
): Promise<PaginatedResponse<Personality> | void> => {
    const params = {
        page: options.page ? options.page - 1 : 0,
        order: options.order || "asc",
        name: options.searchName,
        pageSize: options.pageSize ? options.pageSize : 5,
        withSuggestions: options.withSuggestions,
        language: options?.i18n?.languages[0] || "pt",
        isHidden: options?.isHidden || false,
        nameSpace: options?.nameSpace || NameSpaceEnum.Main,
    };
    const headers = options?.headers || {};

    return request
        .get(`/`, { params, headers })
        .then((response) => {
            const { personalities, totalPages, totalPersonalities } =
                response.data;
            if (options.fetchOnly) {
                return {
                    data: personalities,
                    total: totalPersonalities,
                    totalPages,
                };
            }

            dispatch({
                type: ActionTypes.SEARCH_PERSONALITIES_RESULTS,
                searchPersonalitiesResults: personalities,
            });
            dispatch({
                type: ActionTypes.SET_TOTAL_PAGES,
                totalPages,
            });
        })
        .catch((e) => {
            throw e;
        });
};

const getPersonality = (
    id: string,
    params: Record<string, unknown>,
    t: TranslationFn
): Promise<Personality | void> => {
    return request
        .get(`/${id}`, {
            params,
        })
        .then((response) => {
            return response.data;
        })
        .catch(() => {
            MessageManager.showMessage(
                "error",
                t("personality:errorWhileFetching")
            );
        });
};

const createPersonality = (
    personality: Record<string, unknown>,
    t: TranslationFn
): Promise<Personality | void> => {
    return request
        .post(`/`, personality)
        .then((response) => {
            const { name } = response.data;
            MessageManager.showMessage(
                "success",
                `"${name}" ${t("personalityCreateForm:successMessage")}`
            );
            return response.data;
        })
        .catch((err) => {
            const response = err && err.response;
            if (!response) {
                // TODO: Track unknow errors
                // TODO: use Sentry instead
                // console.log(err);
            }
            const { data } = response;
            MessageManager.showMessage(
                "error",
                data && data.message
                    ? data.message
                    : t("personalityCreateForm:errorMessage")
            );
        });
};

const deletePersonality = (id: string, t: TranslationFn): Promise<void> => {
    return request
        .delete(`/${id}`)
        .then(() => {
            MessageManager.showMessage(
                "success",
                t("personality:deleteSuccess")
            );
        })
        .catch((err) => {
            console.error(err);
            MessageManager.showMessage("error", t("personality:deleteError"));
        });
};

const updatePersonalityHiddenStatus = (
    id: string,
    isHidden: boolean,
    t: TranslationFn,
    recaptcha: string,
    description: string
): Promise<void> => {
    return request
        .put(`/hidden/${id}`, {
            isHidden,
            recaptcha,
            description,
        })
        .then(() => {
            MessageManager.showMessage(
                "success",
                t(`personality:${isHidden ? "hideSuccess" : "unhideSuccess"}`)
            );
        })
        .catch((err) => {
            console.error(err);
            MessageManager.showMessage(
                "error",
                t(`personality:${isHidden ? "hideError" : "unhideError"}`)
            );
        });
};

const personalitiesApi = {
    getPersonalities,
    getPersonality,
    createPersonality,
    deletePersonality,
    updatePersonalityHiddenStatus,
};
export default personalitiesApi;
