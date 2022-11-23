import { message } from "antd";
import { AxiosError } from "axios";
import { TFunction } from "i18next";
import { NextRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";

// A small function to help us deal with errors coming from fetching a flow.
export function handleGetFlowError<S>(
    router: NextRouter,
    flowType:
        | "login"
        | "registration"
        | "settings"
        | "recovery"
        | "verification",
    resetFlow: Dispatch<SetStateAction<S | undefined>>,
    t: TFunction
) {
    return async (err: AxiosError) => {
        switch (err.response?.data.error?.id) {
            case "session_refresh_required" || "session_aal2_required":
                // set refresh to true so we can redirect back to profile after login
                // 2FA is enabled and enforced, but user did not perform 2fa yet
                window.location.href = err.response?.data.redirect_browser_to;
                return;
            case "session_already_available":
                await router.push("/");
                return;
            case "self_service_flow_return_to_forbidden":
                message.error(t("oryErrors:returnAddressForbidden"));
                await requestNewFlow();
                return;
            case "self_service_flow_expired":
                message.error(t("oryErrors:flowExpired"));
                await requestNewFlow();

                return;
            case "security_csrf_violation":
                message.error(t("oryErrors:csrfViolation"));
                await requestNewFlow();

                return;
            case "security_identity_mismatch":
                await requestNewFlow();

                return;
            case "browser_location_change_required":
                // Ory Kratos asks to point the user to this URL.
                window.location.href = err.response.data.redirect_browser_to;
                return;
        }

        if (err.response?.status === 410) {
            await requestNewFlow();
            return;
        }

        return Promise.reject(err);

        async function requestNewFlow() {
            resetFlow(undefined);
            await router.push("/" + flowType);
        }
    };
}

export const handleFlowError = handleGetFlowError;
