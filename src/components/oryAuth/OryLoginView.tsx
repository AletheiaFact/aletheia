import { LoadingOutlined } from "@ant-design/icons"
import { SelfServiceLoginFlow, SubmitSelfServiceLoginFlowBody } from "@ory/client"
import { Card, Col, Row } from "antd"
import { AxiosError } from "axios"
import { useTranslation } from "next-i18next"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import { ory } from "../../lib/orysdk"
import { handleFlowError } from "../../lib/orysdk/errors"
import LoginForm from "./LoginForm"


const OryLoginView = (props) => {
    const [flow, setFlow] = useState<SelfServiceLoginFlow>()
    const { t } = useTranslation()

    const router = useRouter()
    const {
        return_to: returnTo,
        flow: flowId,
        refresh,
        aal
    } = router.query

    useEffect(() => {
        // If the router is not ready yet, or we already have a flow, do nothing.
        if (!router.isReady || flow) {
            return
        }

        // If ?flow=.. was in the URL, we fetch it
        if (flowId) {
            ory
                .getSelfServiceLoginFlow(String(flowId))
                .then(({ data }) => {
                    setFlow(data as SelfServiceLoginFlow)
                })
                .catch(handleFlowError(router, 'login', setFlow, t))
            return
        }

        // Otherwise we initialize it
        ory
            .initializeSelfServiceLoginFlowForBrowsers(
                Boolean(refresh),
                aal ? String(aal) : undefined,
                returnTo ? String(returnTo) : undefined
            )
            .then(({ data }) => {
                setFlow(data as SelfServiceLoginFlow)
            })
            .catch(handleFlowError(router, 'login', setFlow, t))
    }, [flowId, router, router.isReady, aal, refresh, returnTo, flow, t])

    console.log('login flow object ', flow)

    const onSubmit = (values: SubmitSelfServiceLoginFlowBody) => {
        router
            .push(`/ory-login?flow=${flow?.id || ''}`, undefined, { shallow: true })
            .then(() =>
                ory
                    .submitSelfServiceLoginFlow(String(flow?.id), undefined, values)
                    .then((res) => {
                        if (flow?.return_to) {
                            window.location.href = flow?.return_to
                            return
                        }
                        router.push('/home')
                    })
                    .then(() => { })
                    .catch(handleFlowError(router, 'login', setFlow, t))
                    .catch((err: AxiosError) => {
                        if (err.response?.status === 400) {
                            setFlow(err.response?.data)
                            return
                        }
                        return Promise.reject(err)
                    })
            )
    }

    if (!flow) {
        return <LoadingOutlined />
    }

    return (
        <>
            <Row justify="center">
                <Col span={24}>
                    <Card
                        style={{
                            marginTop: 45
                        }}
                    >
                        <LoginForm flow={flow} onSubmit={onSubmit} />
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default OryLoginView
