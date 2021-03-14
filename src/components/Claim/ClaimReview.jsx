import axios from "axios";
import _ from "underscore";
import React, { Component } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Typography, Form, Button, message, Select, Input } from "antd";
import ClaimReviewSelect from "../Form/ClaimReviewSelect";
import { withTranslation } from "react-i18next";

const { Title } = Typography;
const recaptchaRef = React.createRef();

class ClaimReviewForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            classification: "",
            claim: "",
            sentence_hash: "",
            sentence_content: "",
            recaptcha: "",
            source: "",
            disableSubmit: true
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onExpiredCaptcha = this.onExpiredCaptcha.bind(this);
        this.onChangeCaptcha = this.onChangeCaptcha.bind(this);
        this.onChangeClassification = this.onChangeClassification.bind(this);
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

    onChangeClassification(value) {
        if (value) {
            this.setState({ classification: value }, this.toggleDisabledSubmit);
        }
    }

    onSubmit(values) {
        if (recaptchaRef && recaptchaRef.current) {
            recaptchaRef.current.reset();
        }

        this.setState(
            {
                claim: this.props.highlight.claim,
                personality: this.props.highlight.personality,
                sentence_hash: this.props.highlight.props["data-hash"],
                sentence_content: this.props.highlight.content,
                disableSubmit: true
            },
            () => {
                axios
                    .post(`${process.env.API_URL}/claimreview`, this.state, {
                        withCredentials: true
                    })
                    .then(response => {
                        message.success(
                            this.props.t("claimReviewForm:successMessage")
                        );
                        this.props.handleOk();
                    })
                    .catch(err => {
                        const response = err && err.response;
                        if (!response) {
                            console.log(err);
                        }
                        // TODO: Track unknow errors
                        const { data } = response;
                        message.error(
                            data && data.message
                                ? data.message
                                : this.props.t("claimReviewForm:errorMessage")
                        );
                    });
            }
        );
    }

    toggleDisabledSubmit() {
        const recaptcha = !!this.state.recaptcha;
        const classification = !!this.state.classification;
        if (classification && classification.length === "") {
            this.setState({ disableSubmit: true });
        } else {
            if (recaptcha && classification) {
                this.setState({ disableSubmit: !this.state.disableSubmit });
            }
        }
    }

    render() {
        const { t } = this.props;
        if (_.isEmpty(this.props.highlight)) {
            return <Title level={4}> {t("claimReviewForm:titleEmpty")} </Title>;
        } else {
            return (
                <>
                    <Title level={2}> {t("claimReviewForm:title")} </Title>
                    <Form onFinish={this.onSubmit}>
                        <Form.Item
                            name="classification"
                            label={t("claimReviewForm:selectLabel")}
                        >
                            <ClaimReviewSelect
                                type="select"
                                onChange={this.onChangeClassification}
                                defaultValue=""
                            />
                        </Form.Item>
                        <Form.Item
                            name="source"
                            label={t("claimReviewForm:sourceLabel")}
                        >
                            <Input
                                value={this.state.source || ""}
                                onChange={e =>
                                    this.setState({ source: e.target.value })
                                }
                                placeholder={t(
                                    "claimReviewForm:sourcePlaceholder"
                                )}
                            />
                        </Form.Item>
                        <Form.Item>
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey={process.env.RECAPTCHA_SITEKEY}
                                onChange={this.onChangeCaptcha}
                                onExpired={this.onExpiredCaptcha}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="Submit"
                                disabled={this.state.disableSubmit}
                            >
                                {t("claimReviewForm:addReviewButton")}
                            </Button>
                        </Form.Item>
                    </Form>
                </>
            );
        }
    }
}

export default withTranslation()(ClaimReviewForm);
