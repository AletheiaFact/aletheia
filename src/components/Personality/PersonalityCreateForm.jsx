import React, { Component } from "react";
import axios from "axios";
import { Input, Form, Button, Row, message, Avatar, Spin } from "antd";

import WikidataTypeAhead from "../Personality/WikidataTypeAhead";
import { withTranslation } from "react-i18next";
import { stateToHTML } from "draft-js-export-html";

const { TextArea } = Input;

class PersonalityCreateForm extends Component {
    formRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            personality: {},
            inputsDisabled: false,
            isLoading: true
        };
        this.savePersonality = this.savePersonality.bind(this);
        this.updatePersonality = this.updatePersonality.bind(this);
    }

    updatePersonalityState(state) {
        this.setState({ ...state }, () => {
            const { personality } = this.state;
            this.formRef.current.setFieldsValue({
                name: personality.name,
                wikidata: personality.wikidata,
                description: personality.description
            });
        });
    }

    componentDidMount() {
        const self = this;
        if (this.props.edit && this.props.match.params.id) {
            self.getPersonality().then(() => {
                this.setState(
                    { inputsDisabled: true, isLoading: false },
                    () => {
                        const { personality } = this.state;
                        this.formRef.current.setFieldsValue({
                            name: personality.name,
                            wikidata: personality.wikidata,
                            description: personality.description
                        });
                    }
                );
            });
        } else {
            this.setState({ isLoading: false });
        }
    }

    clearForm() {
        this.setState({ inputsDisabled: false, personality: {} }, () => {
            const { personality } = this.state;
            this.formRef.current.setFieldsValue({
                name: "",
                wikidata: "",
                description: ""
            });
        });
    }
    savePersonality() {
        this.formRef.current
            .validateFields()
            .then(values => {
                const personality = Object.assign(
                    this.state.personality,
                    values
                );
                this.setState({ personality });
                // TODO: Check if personality already exists
                axios
                    .post(
                        `${process.env.API_URL}/personality`,
                        this.state.personality
                    )
                    .then(response => {
                        const { name, _id } = response.data;
                        message.success(
                            `"${name}" ${this.props.t(
                                "personalityCreateForm:successMessage"
                            )}`
                        );

                        // Redirect to personality list in case _id is not present
                        const path = _id ? `./${_id}` : "";
                        this.props.history.push(path);
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
                                : this.props.t(
                                      "personalityCreateForm:errorMessage"
                                  )
                        );
                    });
            })
            .catch(errorInfo => {
                console.log(errorInfo);
            });
    }

    updatePersonality(values) {
        axios
            .put(
                `${process.env.API_URL}/personality/${this.props.match.params.id}`,
                this.state.personality
            )
            .then(response => {
                const { name } = response.data;
                message.success(
                    `"${name}" ${this.props.t(
                        "personalityCreateForm:successUpdate"
                    )}`
                );
                // Redirect to personality profile in case _id is not present
                const path = "./";
                this.props.history.push(path);
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
                        : this.props.t("personalityCreateForm:errorUpdate")
                );
            });
    }

    getPersonality() {
        return axios
            .get(
                `${process.env.API_URL}/personality/${this.props.match.params.id}`,
                {
                    params: {
                        language: this.props.i18n.languages[0]
                    }
                }
            )
            .then(response => {
                const personality = response.data;
                this.setState({ personality });
            })
            .catch(() => {
                message.error(this.props.t("personalityCreateForm:errorFetch"));
            });
    }
    render() {
        const { personality } = this.state;
        const { t } = this.props;
        if (!this.state.isLoading) {
            return (
                <>
                    <Row style={{ padding: "10px 30px", marginTop: "10px" }}>
                        <Avatar size={120} src={personality.image} />
                    </Row>
                    <Row style={{ padding: "10px 30px", marginTop: "10px" }}>
                        <Form
                            ref={this.formRef}
                            id="createPersonality"
                            onFinish={
                                this.props.edit
                                    ? this.updatePersonality
                                    : this.savePersonality
                            }
                        >
                            <Form.Item
                                name="wikidata"
                                label={t("personalityCreateForm:wikidata")}
                                rules={[
                                    {
                                        message: t(
                                            "personalityCreateForm:errorNameRequired"
                                        )
                                    }
                                ]}
                                wrapperCol={{ sm: 24 }}
                                style={{
                                    width: "100%"
                                }}
                            >
                                <WikidataTypeAhead
                                    style={{
                                        width: "100%"
                                    }}
                                    callback={this.updatePersonalityState.bind(
                                        this
                                    )}
                                    placeholder={
                                        (this.props.edit &&
                                            this.state.personality.wikidata) ||
                                        ""
                                    }
                                />
                            </Form.Item>
                            <Form.Item
                                name="name"
                                label={t("personalityCreateForm:name")}
                                rules={[
                                    {
                                        required: true,
                                        message: t(
                                            "personalityCreateForm:errorNameRequired"
                                        )
                                    }
                                ]}
                                wrapperCol={{ sm: 24 }}
                                style={{
                                    width: "100%"
                                }}
                            >
                                <Input
                                    value={this.state.personality.name}
                                    disabled={this.state.inputsDisabled}
                                />
                            </Form.Item>
                            <Form.Item
                                name="description"
                                label={t("personalityCreateForm:description")}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please insert a description"
                                    }
                                ]}
                                wrapperCol={{ sm: 24 }}
                                style={{
                                    width: "100%"
                                }}
                            >
                                <TextArea
                                    style={{
                                        width: "100%"
                                    }}
                                    placeholder={t(
                                        "personalityCreateForm:description"
                                    )}
                                    rows={4}
                                    value={this.state.personality.description}
                                    disabled={this.state.inputsDisabled}
                                />
                            </Form.Item>
                            <Form.Item>
                                {this.props.edit ? (
                                    <>
                                        <Button
                                            onClick={this.clearForm.bind(this)}
                                        >
                                            {t(
                                                "personalityCreateForm:clearButton"
                                            )}
                                        </Button>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                        >
                                            {t(
                                                "personalityCreateForm:updateButton"
                                            )}
                                        </Button>
                                    </>
                                ) : (
                                    <Button type="primary" htmlType="submit">
                                        {t("personalityCreateForm:saveButton")}
                                    </Button>
                                )}
                            </Form.Item>
                        </Form>
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
                        width: "100%"
                    }}
                ></Spin>
            );
        }
    }
}

export default withTranslation()(PersonalityCreateForm);
