import axios from "axios";
import { Container, Form, FormGroup, Input, Button } from "reactstrap";
import _ from "underscore";
import React, { Component } from "react";
import ReCAPTCHA from "react-google-recaptcha";

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

    onChangeClassification(e) {
        if (e.target.value) {
            this.setState(
                { classification: e.target.value },
                this.toggleDisabledSubmit
            );
        }
    }

    onSubmit(e) {
        e.preventDefault();
        console.log(this.props);

        if (recaptchaRef && recaptchaRef.current) {
            recaptchaRef.current.reset();
        }

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
                        console.log("Classification Succeed");
                    });
            }
        );
    }

    toggleDisabledSubmit() {
        const recaptcha = !!this.state.recaptcha;
        const classification = !!this.state.classification;
        if (recaptcha && classification) {
            this.setState({ disableSubmit: !this.state.disableSubmit });
        }
    }

    render() {
        if (_.isEmpty(this.props.highlight)) {
            return <h1> Choose a sentence to Fact Check! </h1>;
        } else {
            return (
                <Container>
                    <h1> Classify Sentence </h1>
                    <Form onSubmit={this.onSubmit}>
                        <FormGroup>
                            <Input
                                type="select"
                                onChange={this.onChangeClassification}
                                defaultValue=""
                            >
                                <option value="" disabled>
                                    Select classification
                                </option>
                                <option value="not-fact">Not fact</option>
                                <option value="true">True</option>
                                <option value="true-but">True, but</option>
                                <option value="arguable">Arguable</option>
                                <option value="misleading">Misleading</option>
                                <option value="false">False</option>
                                <option value="unsustainable">
                                    Unsustainable
                                </option>
                                <option value="exaggerated">Exaggerated</option>
                                <option value="unverifiable">
                                    Unverifiable
                                </option>
                            </Input>
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey="6Lc2BtYUAAAAAOUBI-9r1sDJUIfG2nt6C43noOXh"
                                onChange={this.onChangeCaptcha}
                                onExpired={this.onExpiredCaptcha}
                            />
                            <Button
                                type="submit"
                                value="Submit"
                                disabled={this.state.disableSubmit}
                            >
                                Submit
                            </Button>
                        </FormGroup>
                    </Form>
                </Container>
            );
        }
    }
}

export default ClaimReviewForm;
