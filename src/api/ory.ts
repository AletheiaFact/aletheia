/* eslint-disable no-fallthrough */
import { ory } from "../lib/orysdk";
import { handleFlowError } from "../lib/orysdk/errors";
import { AxiosError } from "axios";
import { MessageManager } from "../components/Messages";

const oryGetLoginFlow = ({ router, setFlow, t }) => {
    const { return_to: returnTo, flow: flowId, refresh, aal } = router.query;
    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
        ory.frontend
            .getLoginFlow({ id: flowId })
            .then(({ data }) => {
                setFlow(data);
            })
            .catch(handleFlowError(router, "login", setFlow, t));
        return;
    }
    // Otherwise we initialize it
    ory.frontend
        .createBrowserLoginFlow({
            refresh: Boolean(refresh),
            aal: aal ? String(aal) : undefined,
            returnTo: returnTo ? String(returnTo) : undefined,
        })
        .then(({ data }) => {
            setFlow(data);
        })
        .catch(handleFlowError(router, "login", setFlow, t));
};

const orySubmitLogin = ({ router, flow, setFlow, t, values, shouldGoBack }) => {
    return ory.frontend
        .updateLoginFlow({
            flow: String(flow?.id),
            updateLoginFlowBody: values,
        })
        .then((response) => {
            return ory.frontend
                .toSession()
                .then(() => response)
                .catch((err: AxiosError) => {
                    switch (err.response?.status) {
                        case 403:
                        // This is a legacy error code thrown. See code 422 for
                        // more details.
                        case 422:
                            // This status code is returned when we are trying to
                            // validate a session which has not yet completed
                            // it's second factor
                            return router.push("/login?aal=aal2");
                        case 401:
                            // do nothing, the user is not logged in
                            return router.push("/signup-invite");
                    }

                    // Something else happened!
                    return Promise.reject(err);
                });
        })
        .then(() => {
            MessageManager.showMessage(
                "success",
                `${t("login:loginSuccessfulMessage")}`
            );
            if (flow?.return_to) {
                window.location.href = flow?.return_to;
                MessageManager.showMessage(
                    "success",
                    t("profile:changesSaved")
                );
                return;
            }
            if (shouldGoBack) {
                router.back();
            } else {
                router.push("/");
            }
        })
        .catch(handleFlowError(router, "login", setFlow, t))
        .catch(() => {
            MessageManager.showMessage(
                "error",
                `${t("login:loginFailedMessage")}`
            );
        });
};

const oryGetSettingsFlow = ({ router, setFlow, t }) => {
    return ory.frontend
        .createBrowserSettingsFlow()
        .then(({ data }) => {
            setFlow(data);
        })
        .catch(handleFlowError(router, "settings", setFlow, t));
};

const orySubmitSettings = ({ router, flow, setFlow, t, values }) => {
    return ory.frontend
        .updateSettingsFlow({
            flow: String(flow?.id),
            updateSettingsFlowBody: values,
        })
        .then(() => {
            router.push("/");
            MessageManager.showMessage(
                "success",
                `${t("profile:changesSaved")}`
            );
        })
        .catch(handleFlowError(router, "settings", setFlow, t));
};

const orySubmitTotp = ({ router, flow, setFlow, t, values }) => {
    return ory.frontend
        .updateSettingsFlow({
            flow: String(flow?.id),
            updateSettingsFlowBody: values,
        })
        .then(({ data }) => {
            setFlow(data);
            MessageManager.showMessage(
                "success",
                `${t("profile:changesSaved")}`
            );
        })
        .catch(handleFlowError(router, "settings", setFlow, t));
};

export {
    orySubmitTotp,
    oryGetLoginFlow,
    orySubmitLogin,
    oryGetSettingsFlow,
    orySubmitSettings,
};
