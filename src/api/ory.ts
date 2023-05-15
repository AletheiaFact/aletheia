/* eslint-disable no-fallthrough */
import { ory } from "../lib/orysdk";
import { handleFlowError } from "../lib/orysdk/errors";
import { AxiosError } from "axios";
import { message } from "antd";

const oryGetLoginFlow = ({ router, setFlow, t }) => {
    const { return_to: returnTo, flow: flowId, refresh, aal } = router.query;
    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
        ory.getSelfServiceLoginFlow(String(flowId))
            .then(({ data }) => {
                setFlow(data);
            })
            .catch(handleFlowError(router, "login", setFlow, t));
        return;
    }
    // Otherwise we initialize it
    ory.initializeSelfServiceLoginFlowForBrowsers(
        Boolean(refresh),
        aal ? String(aal) : undefined,
        returnTo ? String(returnTo) : undefined
    )
        .then(({ data }) => {
            setFlow(data);
        })
        .catch(handleFlowError(router, "login", setFlow, t));
};

const orySubmitLogin = ({ router, flow, setFlow, t, values }) => {
    return ory
        .submitSelfServiceLoginFlow(String(flow?.id), undefined, values)
        .then((response) => {
            return ory
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
                            return;
                    }

                    // Something else happened!
                    return Promise.reject(err);
                });
        })
        .then(() => {
            message.success(`${t("login:loginSuccessfulMessage")}`);
            if (flow?.return_to) {
                window.location.href = flow?.return_to;
                message.success(t("profile:changesSaved"));
                return;
            }

            router.push("/");
        })
        .catch(handleFlowError(router, "login", setFlow, t))
        .catch(() => {
            message.error(`${t("login:loginFailedMessage")}`);
        });
};

const oryGetSettingsFlow = ({ router, setFlow, t }) => {
    return ory
        .initializeSelfServiceSettingsFlowForBrowsers()
        .then(({ data }) => {
            setFlow(data);
        })
        .catch(handleFlowError(router, "settings", setFlow, t));
};

const orySubmitSettings = ({ router, flow, setFlow, t, values }) => {
    return ory
        .submitSelfServiceSettingsFlow(String(flow?.id), undefined, values)
        .then(() => {
            router.push("/");
            message.success(t("profile:changesSaved"));
        })
        .catch(handleFlowError(router, "settings", setFlow, t));
};

const orySubmitTotp = ({ router, flow, setFlow, t, values }) => {
    return ory
        .submitSelfServiceSettingsFlow(String(flow?.id), undefined, values)
        .then(({ data }) => {
            setFlow(data);
            message.success(t("profile:changesSaved"));
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
