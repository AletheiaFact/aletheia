import { MessageManager } from "../components/Messages";
import axios from "axios";
import { NameSpaceEnum } from "../types/Namespace";

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
    nameSpace?: string;
};
const getByTargetId = (options: optionsType) => {
    const params = {
        page: options.page ? options.page - 1 : 0,
        order: options.order || "asc",
        pageSize: options.pageSize ? options.pageSize : 5,
        language: options?.i18n?.languages[0],
    };
    return request
        .get(`/target/${options.targetId}`, { params })
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
        nameSpace: options?.nameSpace || NameSpaceEnum.Main,
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

const createSource = (t, router, source: any = {}) => {
    const { nameSpace = NameSpaceEnum.Main } = source;
    return request
        .post("/", source)
        .then((response) => {
            MessageManager.showMessage("success", t("sources:sourcesCreateSuccess"));
            router.push(
                nameSpace === NameSpaceEnum.Main
                    ? "/sources"
                    : `/${nameSpace}/sources`
            );
            return response.data;
        })
        .catch((err) => {
            console.error(err);
            MessageManager.showMessage("error", t("sources:sourcesCreateError"));
        });
};

const getById = (id, t, params = {}) => {
    return request
        .get(`/${id}`, { params })
        .then((response) => {
            return response.data;
        })
        .catch(() => {
            MessageManager.showMessage("error", t("sources:sourcesErrorFetching")); 
        });
};

const SourceApi = {
    getByTargetId,
    createSource,
    get,
    getById,
};

export default SourceApi;
