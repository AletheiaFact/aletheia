import axios from "axios";
import _ from "underscore";
import React, { Component } from "react";
// import ReCAPTCHA from "react-google-recaptcha";
import { Typography, Form, Select, Button, message } from "antd";

const { Option } = Select;
const { Title } = Typography;
// const recaptchaRef = React.createRef();

class ClaimReviewForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            classification: "",
            claim: "",
            sentence_hash: "",
            sentence_content: "",
            // recaptcha: "",
            // disableSubmit: true
            disableSubmit: false
        };
        this.onSubmit = this.onSubmit.bind(this);
        // this.onExpiredCaptcha = this.onExpiredCaptcha.bind(this);
        // this.onChangeCaptcha = this.onChangeCaptcha.bind(this);
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
        // if (recaptchaRef && recaptchaRef.current) {
        //     recaptchaRef.current.reset();
        // }

        this.setState(
            {
                claim: this.props.highlight.claim,
                personality: this.props.highlight.personality,
                sentence_hash: this.props.highlight.props["data-hash"],
                sentence_content: this.props.highlight.content
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
        // const recaptcha = !!this.state.recaptcha;
        // const classification = !!this.state.classification;
        // if (recaptcha && classification) {
        //     this.setState({ disableSubmit: !this.state.disableSubmit });
        // }

        // const classification = !!this.state.classification;
        // if (classification) {
        //     this.setState({ disableSubmit: !this.state.disableSubmit });
        // }
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
                            <Select
                                type="select"
                                onChange={this.onChangeClassification}
                                defaultValue=""
                            >
                                <Option value="" disabled>
                                    Selecione uma classificação
                                </Option>
                                {/* <Option value="not-fact">Not fact</Option> */}
                                <Option value="not-fact">Não é fato</Option>
                                {/* <Option value="true">True</Option> */}
                                <Option value="true">Verdadeiro</Option>
                                {/* <Option value="true-but">True, but</Option> */}
                                <Option value="true-but">
                                    Verdadeiro, mas
                                </Option>
                                {/* <Option value="arguable">Arguable</Option> */}
                                <Option value="arguable">Discutível</Option>
                                {/* <Option value="misleading">Misleading</Option> */}
                                <Option value="misleading">Enganoso</Option>
                                {/* <Option value="false">False</Option> */}
                                <Option value="false">Falso</Option>
                                {/* <Option value="unsustainable">
                                    Unsustainable
                                </Option> */}
                                <Option value="unsustainable">
                                    Insustentável
                                </Option>
                                {/* <Option value="exaggerated">Exaggerated</Option> */}
                                <Option value="exaggerated">Exagerado</Option>
                                {/* <Option value="unverifiable">
                                    Unverifiable
                                </Option> */}
                                <Option value="unverifiable">
                                    Inverificável
                                </Option>
                            </Select>
                            {/* <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey={process.env.RECAPTCHA_SITEKEY}
                                onChange={this.onChangeCaptcha}
                                onExpired={this.onExpiredCaptcha}
                            /> */}
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
