import React, { Component } from "react";
import axios from "axios";
import { Input, Form, Button, Row, Col, message } from "antd";

import ProfilePic from "../Personality/ProfilePic";
import WikidataTypeAhead from "../Personality/WikidataTypeAhead";

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
            console.log(this.state);
        });
    }

    savePersonality() {
        this.formRef.current
            .validateFields()
            .then(values => {
                this.setState({ personality: values });
                console.log("Received values of form: ", values);
                // TODO: Check if personality already exists
                axios
                    .post(
                        `${process.env.API_URL}/personality`,
                        this.state.personality
                    )
                    .then(response => {
                        const { name, _id } = response.data;
                        message.success(
                            `"${name}" profile created with success`
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
                                : "Error while saving personality"
                        );
                    });
            })
            .catch(errorInfo => {
                console.log(errorInfo);
            });
    }

    render() {
        const { personality } = this.state;
        return (
            <Row gutter={[32, 0]}>
                <Col span={6}>
                    <ProfilePic image={personality.image} />
                </Col>
                <Col span={18}>
                    <Form
                        ref={this.formRef}
                        id="createPersonality"
                        onFinish={this.savePersonality}
                    >
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please insert a name"
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
                            label="Description"
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
                                placeholder="Description"
                                rows={4}
                                value={this.state.personality.description}
                                disabled={this.state.inputsDisabled}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Save Personality
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        );
    }
}

export default PersonalityCreate;
