import axios from "axios";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/history`,
});


type optionsType = {
    targetId: string;
    targetModel: string;
    page: number;
    order: "asc" | "desc";
    pageSize: number;
};
const getByTargetId = (options: optionsType) => {
    const params = {
        page: options.page ? options.page-1 : 0,
        order: options.order || "asc",
        pageSize: options.pageSize ? options.pageSize : 5,
    };
    const { targetId, targetModel} = options;

    return request.get(`/${targetModel}/${targetId}`, { params })
        .then((response) => {
            const { history, totalPages, totalChanges } = response.data;
            return {
                data: history,
                total: totalChanges,
                totalPages,
            };
        })
        .catch((err) => {
            console.log(err);
        });

};

const HistoryApi = {
    getByTargetId,
};
export default HistoryApi;
