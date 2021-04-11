import React, { Component } from "react";
import { Editor, EditorState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { stateFromHTML } from "draft-js-import-html";
import "draft-js/dist/Draft.css";
import {
    DatePicker,
    Form,
    Input,
    Button,
    Row,
    Col,
    Typography,
    Spin,
    Checkbox,
    Avatar,
} from "antd";
import claim from "../../api/claim";
import personalityApi from "../../api/personality";
import { withTranslation } from "react-i18next";
import "./ClaimCreate.css";
import ReCAPTCHA from "react-google-recaptcha";
import { connect } from "react-redux";
import { Redirect } from "react-router";

const { Title, Paragraph } = Typography;
const recaptchaRef = React.createRef();

class ClaimCreate extends Component {
    formRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            title: "",
            recaptcha: "",
            editorState: EditorState.createEmpty(),
            disableSubmit: true
        };
        this.onExpiredCaptcha = this.onExpiredCaptcha.bind(this);
        this.onChangeCaptcha = this.onChangeCaptcha.bind(this);
        this.saveClaim = this.saveClaim.bind(this);
        this.updateClaim = this.updateClaim.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    async componentDidMount() {
        console.log(this.props.isLoggedIn);
        if (this.props.isLoggedIn === false) {
            return;
        }

        const personality = await personalityApi.getPersonality(
            this.props.match.params.id,
            {
                language: this.props.i18n.languages[0]
            }
        );
        this.setState({ personality });
        if (this.props.edit) {
            const { content, title } = await claim.getById(
                this.props.match.params.claimId
            );
            const editorState = EditorState.createWithContent(
                stateFromHTML(content.html)
            );
            this.setState(
                {
                    title,
                    editorState,
                    content: stateToHTML(
                        this.state.editorState.getCurrentContent()
                    )
                },
                () => {
                    this.formRef.current.setFieldsValue({
                        title,
                        content: this.state.content
                    });
                }
            );
        }
    }

    async saveClaim() {
        if (recaptchaRef && recaptchaRef.current) {
            recaptchaRef.current.reset();
        }

        console.log(this.state.recaptcha);

        const _id = await claim.save({
            content: stateToHTML(this.state.editorState.getCurrentContent()),
            title: this.state.title,
            personality: this.props.match.params.id,
            // TODO: add a new input when twitter is supported
            type: "speech",
            date: this.state.date,
            recaptcha: this.state.recaptcha
        });
        // Redirect to personality profile in case _id is not present
        const path = _id ? `./${_id}` : "../";
        this.props.history.push(path);
    }

    async updateClaim() {
        await claim.update(this.props.match.params.claimId, {
            title: stateToHTML(this.state.editorState.getCurrentContent()),
            content: this.state.title
        });
        // Redirect to personality profile in case _id is not present
        const path = "./";
        this.props.history.push(path);
    }

    onChange(editorState) {
        this.setState({ editorState }, () => {
            if (this.formRef.current) {
                this.formRef.current.setFieldsValue({
                    content: stateToHTML(
                        this.state.editorState.getCurrentContent()
                    )
                });
            }
        });
    }

    onExpiredCaptcha() {
        return new Promise(resolve => {
            this.setState({ disableSubmit: true });
            resolve();
        });
    }

    onChangeCaptcha() {
        this.setState(
            { recaptcha: recaptchaRef.current.getValue() },
            this.toggleDisabledSubmit
        );
    }

    toggleDisabledSubmit() {
        const recaptcha = !!this.state.recaptcha;
        if (recaptcha) {
            this.setState({ disableSubmit: !this.state.disableSubmit });
        }
    }

    render() {
        const { t } = this.props;
        const { personality } = this.state;
        console.log(this.props.isLoggedIn);

        if (this.props.isLoggedIn === false) {
            return (
                <Redirect
                    to={`/personality/${this.props.match.params.id}`}
                ></Redirect>
            );
        }

        if (personality) {
            return (
                <>
                    <Row
                        style={{
                            padding: "0px 20px"
                        }}
                    >
                        <Col span={24}>
                            <Row
                                style={{
                                    padding: "10px 30px",
                                    marginTop: "10px",
                                    width: "100%"
                                }}
                            >
                                <Col span={this.avatarSpan}>
                                    <Avatar
                                        size={this.avatarSize}
                                        src={personality.image}
                                    />
                                </Col>
                                <Col span={3}></Col>
                                <Col span={this.titleSpan}>
                                    <Title
                                        level={4}
                                        style={{ marginBottom: 0 }}
                                    >
                                        {personality.name}
                                    </Title>
                                    <Paragraph
                                        style={
                                            this.props.summarized && {
                                                fontSize: "12px"
                                            }
                                        }
                                    >
                                        {personality.description}
                                    </Paragraph>
                                </Col>
                            </Row>
                            <Form
                                ref={this.formRef}
                                layout="vertical"
                                id="createClaim"
                                onFinish={
                                    this.props.edit
                                        ? this.updateClaim
                                        : this.saveClaim
                                }
                            >
                                <Form.Item
                                    name="title"
                                    label={t("claimForm:titleField")}
                                    rules={[
                                        {
                                            required: true,
                                            message: t(
                                                "claimForm:titleFieldError"
                                            )
                                        }
                                    ]}
                                    wrapperCol={{ sm: 24 }}
                                    style={{
                                        width: "100%"
                                    }}
                                >
                                    <Input
                                        value={this.state?.title || ""}
                                        onChange={e =>
                                            this.setState({
                                                title: e.target.value
                                            })
                                        }
                                        placeholder={t(
                                            "claimForm:titleFieldPlaceholder"
                                        )}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="content"
                                    label={t("claimForm:contentField")}
                                    rules={[
                                        {
                                            required: true,
                                            message: t(
                                                "claimForm:contentFieldError"
                                            )
                                        }
                                    ]}
                                    extra={t("claimForm:contentFieldHelp")}
                                    wrapperCol={{ sm: 24 }}
                                    style={{
                                        width: "100%",
                                        marginBottom: "24px"
                                    }}
                                >
                                    <div className="ant-input">
                                        <Editor
                                            placeholder={t(
                                                "claimForm:contentFieldPlaceholder"
                                            )}
                                            editorState={
                                                this.state?.editorState
                                            }
                                            onChange={this.onChange}
                                        />
                                    </div>
                                </Form.Item>
                                <Form.Item
                                    name="date"
                                    label={t("claimForm:dateField")}
                                    rules={[
                                        {
                                            required: true,
                                            message: t(
                                                "claimForm:dateFieldError"
                                            )
                                        }
                                    ]}
                                    extra={t("claimForm:dateFieldHelp")}
                                    wrapperCol={{ sm: 24 }}
                                    style={{
                                        width: "100%",
                                        marginBottom: "24px"
                                    }}
                                >
                                    <DatePicker
                                        style={{
                                            width: "100%"
                                        }}
                                        placeholder={t(
                                            "claimForm:dateFieldPlaceholder"
                                        )}
                                        onChange={value =>
                                            this.setState({
                                                date: value
                                            })
                                        }
                                    />
                                </Form.Item>
                                <Form.Item
                                    style={{
                                        color: "#973A3A"
                                    }}
                                >
                                    {t("claimForm:disclaimer")}
                                </Form.Item>
                                <Form.Item
                                    name="accept_terms"
                                    rules={[
                                        {
                                            required: true,
                                            message: t(
                                                "claimForm:errorAcceptTerms"
                                            )
                                        }
                                    ]}
                                    valuePropName="checked"
                                >
                                    <Checkbox>
                                        {t("claimForm:checkboxAcceptTerms")}
                                    </Checkbox>
                                </Form.Item>

                                <Form.Item>
                                    <ReCAPTCHA
                                        ref={recaptchaRef}
                                        sitekey={process.env.RECAPTCHA_SITEKEY}
                                        onChange={this.onChangeCaptcha}
                                        onExpired={this.onExpiredCaptcha}
                                    />
                                </Form.Item>
                                <Row
                                    style={{
                                        justifyContent: "space-evenly",
                                        marginBottom: "20px"
                                    }}
                                >
                                    <Button onClick={this.props.history.goBack}>
                                        {t("claimForm:cancelButton")}
                                    </Button>
                                    {this.props.edit ? (
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            disabled={this.state.disableSubmit}
                                        >
                                            {t("claimForm:updateButton")}
                                        </Button>
                                    ) : (
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            disabled={this.state.disableSubmit}
                                        >
                                            {t("claimForm:saveButton")}
                                        </Button>
                                    )}
                                </Row>
                            </Form>
                        </Col>
                    </Row>
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
        isLoggedIn: state?.login
    };
};

export default connect(mapStateToProps)(withTranslation()(ClaimCreate));
