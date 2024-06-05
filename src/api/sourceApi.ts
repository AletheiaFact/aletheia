import { message } from "antd";
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

const get = (options: optionsType) => {
    const params = {
        page: options.page ? options.page - 1 : 0,
        order: options.order || "asc",
        pageSize: options.pageSize ? options.pageSize : 5,
        language: options?.i18n?.languages[0],
    };

    return request
        .get(`/`, { params })
        .then((response) => {
            const { sources, totalPages, totalSources } = response.data;

            return {
                data: sources,
                total: totalSources,
                totalPages,
            };
        })
        .catch((err) => {
            console.log(err);
        });
};

const createSource = (t, router, source = {}) => {
    return request
        .post("/", source)
        .then((response) => {
            message.success(t("sources:sourcesCreateSuccess"));
            router.push("/sources");
            return response.data;
        })
        .catch((err) => {
            console.error(err);
            message.error(t("sources:sourcesCreateError"));
        });
};

const SourceApi = {
    getByTargetId,
    createSource,
    get,
};

export default SourceApi;
