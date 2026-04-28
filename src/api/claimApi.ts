import { MessageManager } from "../components/Messages";
import { NameSpaceEnum } from "../types/Namespace";
import type { Claim } from "../types/Claim";
import type {
    PaginatedResponse,
    ClaimCreateResponse,
    TranslationFn,
} from "../types/ApiResponse";
import { createApiInstance } from "./apiFactory";

const request = createApiInstance("/api/claim");

interface FetchOptions {
    page?: number;
    order?: "asc" | "desc";
    pageSize?: number;
    isHidden?: boolean;
    nameSpace?: string;
    personality: string;
    i18n?: { languages?: any };
    fetchOnly?: boolean;
}

const get = (
    options: FetchOptions
): Promise<PaginatedResponse<Claim> | void> => {
    const params = {
        page: options.page ? options.page - 1 : 0,
        order: options.order || "asc",
        pageSize: options.pageSize ? options.pageSize : 5,
        personality: options.personality,
        language: options?.i18n?.languages[0],
        isHidden: options?.isHidden || false,
        nameSpace: options?.nameSpace || NameSpaceEnum.Main,
    };

    return request
        .get("/", { params })
        .then((response) => {
            const { claims, totalPages, totalClaims } = response.data;
            if (options.fetchOnly) {
                return {
                    data: claims,
                    total: totalClaims,
                    totalPages,
                };
            }
        })
        .catch((e) => {
            throw e;
        });
};

const getById = (
    id: string,
    t: TranslationFn,
    params = {}
): Promise<Claim | void> => {
    return request
        .get(`/${id}`, { params })
        .then((response) => {
            return response.data;
        })
        .catch(() => {
            MessageManager.showMessage(
                "error",
                `${t("claim:errorWhileFetching")}`
            );
        });
};

const executeClaimRequest = async (
    endpoint: string,
    payload: any,
    t: TranslationFn
): Promise<ClaimCreateResponse | void> => {
    try {
        const response = await request.post(endpoint, payload);
        const { title } = response.data;

        MessageManager.showMessage(
            "success",
            `"${title}" ${t("claimForm:successCreateMessage")}`
        );
        return response.data;

    } catch (err: any) {
        const response = err?.response;
        const data = response?.data;
        const status = response?.status;

        let errorMessage = t("claimForm:errorCreateMessage");


        if (status === 409) {
            const titleUsed = payload?.title || "";
            errorMessage = `"${titleUsed}" ${t("claimForm:errorDuplicateTitle")}`;
        }

        else if (data?.message) {
            if (typeof data.message === "string") {
                errorMessage = data.message;
            } else if (typeof data.message?.message === "string") {
                errorMessage = data.message.message;
            } else if (Array.isArray(data.message)) {
                errorMessage = data.message[0];
            }
        }

        MessageManager.showMessage("error", errorMessage);

        // TODO: Track errors with Sentry
        if (!err.response) {
            console.error(err);
        }

        throw err;
    }
};

const saveSpeech = (t: TranslationFn, claim = {}) =>
    executeClaimRequest("/", claim, t);

const saveImage = (t: TranslationFn, claimImage = {}) =>
    executeClaimRequest("/image", claimImage, t);

const saveDebate = (t: TranslationFn, debate = {}) =>
    executeClaimRequest("/debate", debate, t);

const saveUnattributed = (t: TranslationFn, unattributed = {}) =>
    executeClaimRequest("/unattributed", unattributed, t);

const updateDebate = (
    debateId: string,
    t: TranslationFn,
    params: { content: string; personality: string; isLive: boolean }
): Promise<unknown> => {
    return request
        .put(`/debate/${debateId}`, params)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            const response = err && err.response;
            if (!response) {
                // TODO: Track errors with Sentry
            }
            const { data } = response;
            MessageManager.showMessage(
                "error",
                data && data.message
                    ? data.message
                    : t("claimForm:errorUpdateMessage")
            );
        });
};

const deleteClaim = (id: string, t: TranslationFn): Promise<void> => {
    return request
        .delete(`/${id}`)
        .then(() => {
            MessageManager.showMessage("success", t("claim:deleteSuccess"));
        })
        .catch((err) => {
            console.error(err);
            MessageManager.showMessage("error", t("claim:deleteError"));
        });
};

const updateClaimHiddenStatus = (
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
                t(`claim:${isHidden ? "hideSuccess" : "unhideSuccess"}`)
            );
        })
        .catch((err) => {
            console.error(err);
            MessageManager.showMessage(
                "error",
                t(`claim:${isHidden ? "hideError" : "unhideError"}`)
            );
        });
};

const claimApi = {
    get,
    getById,
    saveSpeech,
    saveImage,
    saveDebate,
    saveUnattributed,
    updateDebate,
    deleteClaim,
    updateClaimHiddenStatus,
};
export default claimApi;
