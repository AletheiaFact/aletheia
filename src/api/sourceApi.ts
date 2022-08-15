import axios from "axios";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/source`,
});

type optionsType = {
    targetId: string;
    page: number;
    order: "asc" | "desc";
    pageSize: number;
    i18n: { languages: string[] };
};
const getByTargetId = (options: optionsType) => {
    const params = {
        page: options.page ? options.page - 1 : 0,
        order: options.order || "asc",
        pageSize: options.pageSize ? options.pageSize : 5,
        language: options?.i18n?.languages[0],
    };
    return request
        .get(`${options.targetId}`, { params })
        .then((response) => {
            const { sources, totalPages, totalSources } = response.data;
            return {
                data: sources,
                total: totalSources,
                totalPages,
            };
        })
        .catch((err) => {
            // TODO: use Sentry instead
            // console.log(err);
        });
};

const SourceApi = {
    getByTargetId,
};
export default SourceApi;
