import React, { Component } from "react";
import axios from "axios";
import { Input, Form, Button, Row, Col } from "antd";

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
        this.setState({ ...state });
    }

    savePersonality() {
        console.log(this.formRef);
        this.formRef.current.validateFields().then(values => {
            console.log("Received values of form: ", values);
            // TODO: Check if personality already exists
            axios
                .post(
                    `${process.env.API_URL}/personality`,
                    this.state.personality
                )
                .then(response => {
                    console.log(response.data);
                })
                .catch(() => {
                    console.log("Error while saving claim");
                });
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
                        <WikidataTypeAhead
                            style={{
                                width: "100%"
                            }}
                            callback={this.updatePersonalityState.bind(this)}
                        />
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your password!"
                                }
                            ]}
                            hasFeedback
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
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your password!"
                                }
                            ]}
                        >
                            <Input />
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
