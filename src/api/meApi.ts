import { MessageManager } from "../components/Messages";
import type { TranslationFn } from "../types/ApiResponse";
import { createApiInstance } from "./apiFactory";

const request = createApiInstance("/api/me");

const deleteAccount = (t: TranslationFn): Promise<boolean> => {
    return request
        .delete("")
        .then(() => {
            MessageManager.showMessage(
                "success",
                t("profile:deleteSuccessMessage")
            );
            return true;
        })
        .catch(() => {
            MessageManager.showMessage(
                "error",
                t("profile:deleteErrorMessage")
            );
            return false;
        });
};

const meApi = { deleteAccount };

export default meApi;
