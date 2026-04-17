import { createApiInstance } from "./apiFactory";

const request = createApiInstance("/api/history");

type OptionsType = {
    targetId: string;
    targetModel: string;
    page?: number;
    order?: "asc" | "desc";
    pageSize?: number;
};

const getByTargetId = (options: OptionsType) => {
    const params = {
        page: options.page ? options.page - 1 : 0,
        order: options.order || "asc",
        pageSize: options.pageSize ? options.pageSize : 5,
    };
    const { targetId, targetModel } = options;

    return request
        .get(`/${targetModel}/${targetId}`, { params })
        .then((response) => {
            const { history, totalPages, totalChanges } = response.data;
            return {
                data: history,
                total: totalChanges,
                totalPages,
            };
        })
        .catch((err) => {
            console.error(err);
            return { data: [], total: 0, totalPages: 0 };
        });
};

const HistoryApi = {
    getByTargetId,
};

export default HistoryApi;
