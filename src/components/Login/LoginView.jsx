import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Form, Input, Button, Row, Col, Card } from "antd";
import api from "../../api/user";
import BackButton from "../BackButton";
import CTARegistration from "../Home/CTARegistration";
import { connect } from "react-redux";

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 }
};

class LoginView extends Component {
    constructor() {
        super();
        this.state = {
            type: "login"
        };
    }
    onFinish = async values => {
        const result = await api.login(values, this.props.t);
        if (!result.login) {
            this.onFinishFailed(result.message);
        }
    };

    onFinishFailed = errorInfo => {
        console.log("Failed:", errorInfo);
    };

    render() {
        const { t } = this.props;
        return (
            <>
                <Row justify="center">
                    <Col xl={6} lg={8} md={10} sm={12} xs={24}>
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
                                    <Col
                                        span={24}
                                        className="typo-grey typo-center"
                                    >
                                        <h2>{t("login:formHeader")}</h2>
                                    </Col>
                                    <Form
                                        {...layout}
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
                                        <Form.Item {...tailLayout}>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                            >
                                                {t("login:submitButton")}
                                            </Button>
                                        </Form.Item>
                                    </Form>
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

const mapStateToProps = state => {
    return {
        menuCollapsed:
            state?.menuCollapsed !== undefined ? state?.menuCollapsed : true
    };
};

export default connect(mapStateToProps)(withTranslation()(LoginView));
