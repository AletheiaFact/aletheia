import { LoadingOutlined } from "@ant-design/icons"
import { SelfServiceRegistrationFlow, SubmitSelfServiceRegistrationFlowBody } from "@ory/client"
import { Card, Col, Row } from "antd"
import { AxiosError } from "axios"
import { useTranslation } from "next-i18next"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import { ory } from "../../lib/orysdk"
import { handleFlowError } from "../../lib/orysdk/errors"
import SignUpForm from "./SignUpForm"


const OrySignUpView = (props) => {
    const [flow, setFlow] = useState<SelfServiceRegistrationFlow>()
    const { t } = useTranslation()

    const router = useRouter()
    const { flow: flowId, return_to: returnTo } = router.query

    // In this effect we either initiate or fetch an registration flow.
    useEffect(() => {
        if (!router.isReady || flow) {
            return
        }

        if (flowId && flowId !== 'undefined') {
            ory
                .getSelfServiceRegistrationFlow(String(flowId))
                .then(({ data }) => {
                    setFlow(data)
                })
                .catch(handleFlowError(router, 'registration', setFlow, t))
            return
        }

        ory
            .initializeSelfServiceRegistrationFlowForBrowsers(
                returnTo ? String(returnTo) : undefined
            )
            .then(({ data }) => {
                setFlow(data)
            })
            .catch(handleFlowError(router, 'registration', setFlow, t))
    }, [flowId, router, router.isReady, returnTo, flow, t])

    console.log('registration flow object ', flow)

    const onSubmit = (values: SubmitSelfServiceRegistrationFlowBody) => {
        router
            // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
            // data when she/he reloads the page.
            .push(`/ory-signup?flow=${flow?.id || ''}`, undefined, { shallow: true })
            .then(() =>
                ory
                    .submitSelfServiceRegistrationFlow(flow?.id, values)
                    .then(({ data }) => {
                        // Successfully signed up! You can access the identity which just signed up:
                        console.log('This is the user session: ', data, data.identity)

                        return router.push(flow?.return_to || '/home').then(() => { })
                    })
                    .catch(handleFlowError(router, 'registration', setFlow, t))
                    .catch((err: AxiosError) => {
                        // If the previous handler did not catch the error it's most likely a form validation error
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
                        <SignUpForm flow={flow} onSubmit={onSubmit} />
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default OrySignUpView
