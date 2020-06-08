import axios from "axios";
import _ from "underscore";
import React, { Component } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import {Typography, Form, Button, message, Select} from "antd";
import ClaimReviewSelect from "../Form/ClaimReviewSelect";

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
            disableSubmit: true
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onExpiredCaptcha = this.onExpiredCaptcha.bind(this);
        this.onChangeCaptcha = this.onChangeCaptcha.bind(this);
        this.onChangeClassification = this.onChangeClassification.bind(this);
    }

    onExpiredCaptcha() {
        return new Promise(resolve => {
            console.log("expired captcha");
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
                    .post(`${process.env.API_URL}/claimreview`, this.state)
                    .then(response => {
                        message.success("Revisão concluída!");
                        this.props.handleOk();
                    })
                    .catch(err => {
                        const response = err && err.response;
                        if (!response) {
                            // TODO: Track unknow errors
                            console.log(err);
                        }
                        const { data } = response;
                        message.error(
                            data && data.message
                                ? data.message
                                : "Erro ao enviar revisão"
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
        if (_.isEmpty(this.props.highlight)) {
            return <Title level={4}> Escolha uma frase para revisar </Title>;
        } else {
            return (
                <>
                    <Title level={2}> Classifique a frase </Title>
                    <Form onFinish={this.onSubmit}>
                        <Form.Item>
                            <ClaimReviewSelect
                                type="select"
                                onChange={this.onChangeClassification}
                                defaultValue=""
                            />
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey={process.env.RECAPTCHA_SITEKEY}
                                onChange={this.onChangeCaptcha}
                                onExpired={this.onExpiredCaptcha}
                            />
                            <br />
                            <Button
                                type="primary"
                                htmlType="Submit"
                                disabled={this.state.disableSubmit}
                            >
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </>
            );
        }
    }
}

export default ClaimReviewForm;
