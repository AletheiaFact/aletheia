import { ory } from "../lib/orysdk";
import { handleFlowError } from "../lib/orysdk/errors";
import { AxiosError } from "axios";
import { message } from "antd";


const oryGetLoginFlow = ({ router, setFlow, t }) => {
    const {
        return_to: returnTo,
        refresh,
        aal
    } = router.query

    return ory
        .initializeSelfServiceLoginFlowForBrowsers(
            Boolean(refresh),
            aal ? String(aal) : undefined,
            returnTo ? String(returnTo) : undefined
        )
        .then(({ data }) => {
            setFlow(data)
        })
        .catch(handleFlowError(router, 'login', setFlow, t))
}

const orySubmitLogin = ({router, flow, setFlow, t, values}) => {
    return ory
        .submitSelfServiceLoginFlow(String(flow?.id), undefined, values)
        .then(() => {
            message.success(
                `${t("login:loginSuccessfulMessage")}`
            );
            if (flow?.return_to) {
                window.location.href = flow?.return_to
                return
            }
            router.push('/home')
        })
        .catch(handleFlowError(router, 'login', setFlow, t))
        .catch((err: AxiosError) => {
            if (err.response?.status === 400) {
                setFlow(err.response?.data)
                return
            }
            return Promise.reject(err)
        })
}

export {
    oryGetLoginFlow,
    orySubmitLogin
}
