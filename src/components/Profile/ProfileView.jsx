import React, { Component } from "react";
import {
    Alert,
    Button,
    Form,
    Input,
    message,
    Row,
    Spin,
    Typography
} from "antd";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import api from "../../api/user";

class ProfileView extends Component {
    formRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            loadingUser: true,
            loadingFinish: false
        };
        this.onFinish = this.onFinish.bind(this);
    }

    redirectToLogin() {
        message.error(this.props.t("profile:userUnauthenticated"));
        this.props.history.push("/login");
    }

    async updatePassword(data) {
        return await api.updatePassword(
            {
                userId: this.props.user._id,
                ...data
            },
            this.props.t
        );
    }

    async onFinish(values) {
        this.setState({ loadingFinish: true });
        const result = await this.updatePassword(values);
        if (!result.success) {
            message.error(result.message);
        } else {
            message.success(this.props.t("profile:successMessage"));
            this.formRef.current.resetFields();
        }
        this.setState({ loadingFinish: false });
    }

    componentDidMount() {
        if (this.props.login === undefined) {
            this.setState({
                loadingUser: true
            });
        } else {
            if (this.props.login === false && !this.state.loadingUser) {
                this.redirectToLogin();
            }
            this.setState({
                loadingUser: false
            });
        }
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        if (nextProps.login !== undefined && this.state.loadingUser) {
            if (nextProps.login === false) {
                this.redirectToLogin();
            }
            this.setState({
                loadingUser: false
            });
        }
    }

    render() {
        const { t, user } = this.props;
        const { loadingUser } = this.state;
        if (!loadingUser) {
            return (
                <>
                    <Row style={{ padding: "10px 0 10px 0" }}>
                        <Typography.Title level={3}>
                            {t("profile:pageTitle")}
                        </Typography.Title>
                    </Row>
                    <Row>
                        <Typography.Title level={4}>
                            {t("profile:changePasswordSectionTitle")}
                        </Typography.Title>
                    </Row>
                    {!user.firstPasswordChanged && (
                        <Row style={{ paddingBottom: "10px" }}>
                            <Alert
                                message={t("profile:warningMessage")}
                                type="warning"
                            />
                        </Row>
                    )}
                    <Form ref={this.formRef} onFinish={this.onFinish}>
                        <Form.Item
                            name="currentPassword"
                            label={t("profile:currentPasswordLabel")}
                            rules={[
                                {
                                    required: true,
                                    message: t("profile:requiredFieldError")
                                }
                            ]}
                            wrapperCol={{ sm: 24 }}
                            style={{
                                width: "100%"
                            }}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            name="newPassword"
                            label={t("profile:newPasswordLabel")}
                            rules={[
                                {
                                    required: true,
                                    message: t("profile:requiredFieldError")
                                }
                            ]}
                            wrapperCol={{ sm: 24 }}
                            style={{
                                width: "100%"
                            }}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            name="repeatedNewPassword"
                            label={t("profile:repeatedNewPasswordLabel")}
                            rules={[
                                {
                                    required: true,
                                    message: t("profile:requiredFieldError")
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (
                                            !value ||
                                            getFieldValue("newPassword") ===
                                                value
                                        ) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error(
                                                t(
                                                    "profile:passwordMatchErrorMessage"
                                                )
                                            )
                                        );
                                    }
                                })
                            ]}
                            wrapperCol={{ sm: 24 }}
                            style={{
                                width: "100%"
                            }}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={this.state.loadingFinish}
                            >
                                {t("login:submitButton")}
                            </Button>
                        </Form.Item>
                    </Form>
                </>
            );
        } else {
            return (
                <Spin
                    tip={t("global:loading")}
                    style={{
                        textAlign: "center",
                        position: "absolute",
                        top: "50%",
                        left: "calc(50% - 40px)"
                    }}
                ></Spin>
            );
        }
    }
}

const mapStateToProps = state => {
    return {
        login: state?.login,
        user: state?.user || {}
    };
};

export default connect(mapStateToProps)(withTranslation()(ProfileView));
