import React, { Component } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Form, Button, Input } from "antd";
import ClaimReviewSelect from "../Form/ClaimReviewSelect";
import { withTranslation } from "react-i18next";
import claimReviewApi from "../../api/claimReview";

const recaptchaRef = React.createRef();

class ClaimReviewForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            classification: "",
            claim: this.props.claimId,
            personality: this.props.personalityId,
            sentence_hash: this.props.highlight.props["data-hash"],
            sentence_content: this.props.highlight.content,
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

    onSubmit() {
        if (recaptchaRef && recaptchaRef.current) {
            recaptchaRef.current.reset();
        }

        this.setState(
            {
                disableSubmit: true
            },
            () => {
                claimReviewApi.save(this.state, this.props.t).then(response => {
                    if (response.success) {
                        this.props.handleOk();
                    }
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
        return (
            <>
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
                            placeholder={t("claimReviewForm:sourcePlaceholder")}
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
                        <Button onClick={this.props.handleCancel}>
                            {t("claimReviewForm:cancelButton")}
                        </Button>
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

export default withTranslation()(ClaimReviewForm);
