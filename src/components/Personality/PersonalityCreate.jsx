import React, { Component } from "react";
import axios from "axios";
import { Input, Form, Button, Row, Col, message, Avatar } from "antd";

import WikidataTypeAhead from "../Personality/WikidataTypeAhead";
import { withTranslation } from "react-i18next";

const { TextArea } = Input;

class PersonalityCreate extends Component {
    formRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            personality: {},
            inputsDisabled: false
        };
        this.savePersonality = this.savePersonality.bind(this);
    }

    updatePersonalityState(state) {
        this.setState({ ...state }, () => {
            const { personality } = this.state;
            this.formRef.current.setFieldsValue({
                name: personality.name,
                description: personality.description
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

    render() {
        const { personality } = this.state;
        const { t } = this.props;
        return (
            <>
                <Row style={{ padding: "10px 30px", marginTop: "10px" }}>
                    <Avatar size={120} src={personality.image} />
                </Row>
                <Row style={{ padding: "10px 30px", marginTop: "10px" }}>
                    <Form
                        ref={this.formRef}
                        id="createPersonality"
                        onFinish={this.savePersonality}
                    >
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
                            <WikidataTypeAhead
                                style={{
                                    width: "100%"
                                }}
                                callback={this.updatePersonalityState.bind(
                                    this
                                )}
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
                            <Button type="primary" htmlType="submit">
                                {t("personalityCreateForm:saveButton")}
                            </Button>
                        </Form.Item>
                    </Form>
                </Row>
            </>
        );
    }
}

export default withTranslation()(PersonalityCreate);
