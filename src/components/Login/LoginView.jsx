import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Form, Input, Button, Row, Col, Card, message } from "antd";
import api from "../../api/user";
import BackButton from "../BackButton";
import CTARegistration from "../Home/CTARegistration";
import { withRouter } from "react-router-dom";

class LoginView extends Component {
    constructor() {
        super();
        this.state = {
            type: "login"
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (props.location.pathname !== state.prevPath) {
            return {
                prevPath: props.location.pathname
            };
        }
        return null;
    }

    onFinish = async values => {
        const result = await api.login(values, this.props.t);

        if (!result.login) {
            this.onFinishFailed(result.message);
        } else {
            message.success(this.props.t("login:loginSuccessfulMessage"));
            if (this.state.prevPath === this.props.location.pathname) {
                this.props.history.push("/");
            } else {
                this.props.history.push(this.state.prevPath);
            }
        }
    };

    onFinishFailed = errorInfo => {
        if (typeof errorInfo === "string") {
            message.error(errorInfo);
        } else {
            message.error(this.props.t("login:loginFailedMessage"));
        }
    };

    render() {
        const { t } = this.props;
        return (
            <>
                <Row justify="center">
                    <Col span={24}>
                        <Card
                            style={{
                                marginTop: 45,
                                ...(this.state.type === "signup" && {
                                    backgroundColor: "#2D77A3"
                                })
                            }}
                        >
                            {this.state.type === "login" && (
                                <>
                                    <Row className="typo-grey typo-center">
                                        <h2>{t("login:formHeader")}</h2>
                                    </Row>
                                    <Form
                                        name="basic"
                                        initialValues={{ remember: true }}
                                        onFinish={this.onFinish}
                                        onFinishFailed={this.onFinishFailed}
                                    >
                                        <Form.Item
                                            label={t("login:emailLabel")}
                                            name="email"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: t(
                                                        "login:emailErrorMessage"
                                                    )
                                                }
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>

                                        <Form.Item
                                            label={t("login:passwordLabel")}
                                            name="password"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: t(
                                                        "login:passwordErrorMessage"
                                                    )
                                                }
                                            ]}
                                        >
                                            <Input.Password />
                                        </Form.Item>
                                        <Form.Item>
                                            <div
                                                style={{
                                                    justifyContent:
                                                        "space-between",
                                                    display: "flex"
                                                }}
                                            >
                                                <a
                                                    onClick={() => {
                                                        this.setState({
                                                            type: "signup"
                                                        });
                                                    }}
                                                    style={{}}
                                                >
                                                    {t("login:signup")}
                                                </a>
                                                <Button
                                                    type="primary"
                                                    htmlType="submit"
                                                >
                                                    {t("login:submitButton")}
                                                </Button>
                                            </div>
                                        </Form.Item>
                                    </Form>
                                </>
                            )}
                            {this.state.type === "signup" && (
                                <>
                                    <BackButton
                                        callback={() =>
                                            this.setState({
                                                type: "login"
                                            })
                                        }
                                        style={{
                                            color: "#fff",
                                            textDecoration: "underline"
                                        }}
                                    />
                                    <CTARegistration />
                                </>
                            )}
                        </Card>
                    </Col>
                </Row>
            </>
        );
    }
}

export default withRouter(withTranslation()(LoginView));
