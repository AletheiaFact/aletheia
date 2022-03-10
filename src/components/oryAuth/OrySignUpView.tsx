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
    const [flow, setFlow] = useState<SelfServiceRegistrationFlow>(props.flow)
    const { t } = useTranslation()
    const router = useRouter()

    const onSubmit = (values: SubmitSelfServiceRegistrationFlowBody) => {
        ory
            .submitSelfServiceRegistrationFlow(flow?.id, values)
            .then(({ data }) => {
                // Successfully signed up! You can access the identity which just signed up:
                console.log('This is the user session: ', data, data.identity)

                // return router.push(flow?.return_to || '/home').then(() => { })
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
