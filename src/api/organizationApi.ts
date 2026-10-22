import { TFunction } from "i18next";
import { MessageManager } from "../components/Messages";
import { Organization, OrganizationInput } from "../types/Organization";
import { createApiInstance } from "./apiFactory";

const request = createApiInstance("/api/organization");

const search = (name: string, t: TFunction): Promise<Organization[]> => {
    return request
        .get("/", { params: { name } })
        .then((response) => response.data)
        .catch(() => {
            MessageManager.showMessage(
                "error",
                t("events:organizationSearchError")
            );
            return [];
        });
};

const create = (
    organization: OrganizationInput,
    t: TFunction
): Promise<Organization> => {
    return request
        .post("/", organization)
        .then((response) => response.data)
        .catch((err) => {
            MessageManager.showMessage(
                "error",
                t(
                    err?.response?.status === 409
                        ? "events:organizationAlreadyExists"
                        : "events:organizationSaveError"
                )
            );
            throw err;
        });
};

const update = (
    id: string,
    organization: Partial<OrganizationInput>,
    t: TFunction
): Promise<Organization> => {
    return request
        .patch(`/${id}`, organization)
        .then((response) => response.data)
        .catch((err) => {
            MessageManager.showMessage(
                "error",
                t(
                    err?.response?.status === 409
                        ? "events:organizationAlreadyExists"
                        : "events:organizationSaveError"
                )
            );
            throw err;
        });
};

const OrganizationApi = {
    search,
    create,
    update,
};

export default OrganizationApi;
