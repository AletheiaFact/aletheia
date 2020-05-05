import React, { Component } from "react";
import axios from "axios";
import { Editor, EditorState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import "draft-js/dist/Draft.css";
import { Typography, Form, Input, Button, message, Row, Col } from "antd";

const { Title } = Typography;
class ClaimCreate extends Component {
    formRef = React.createRef();

    constructor(props) {
        super(props);

        this.state = {
            editorState: EditorState.createEmpty()
        };
        this.saveClaim = this.saveClaim.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    saveClaim(values) {
        console.log(values);
        const content = stateToHTML(this.state.editorState.getCurrentContent());
        const title = this.state.title;
        const personality = this.props.match.params.id;
        axios
            .post(`${process.env.API_URL}/claim`, {
                title,
                content,
                personality
            })
            .then(response => {
                const { title, _id } = response.data;
                message.success(`"${title}" created with success`);
                // Redirect to personality profile in case _id is not present
                const path = _id ? `./${_id}` : "../";
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
                        : "Error while saving claim"
                );
            });
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

    render() {
        return (
            <Row gutter={[32, 0]}>
                <Col span={24}>
                    <Title level={2}>
                        <center>Create Claim</center>
                    </Title>
                    <Form
                        ref={this.formRef}
                        id="createClaim"
                        onFinish={this.saveClaim}
                    >
                        <Form.Item
                            name="title"
                            label="Title"
                            rules={[
                                {
                                    required: true,
                                    message: "Please insert a title"
                                }
                            ]}
                            wrapperCol={{ sm: 24 }}
                            style={{
                                width: "100%"
                            }}
                        >
                            <Input
                                value={this.state.title || ""}
                                onChange={e =>
                                    this.setState({ title: e.target.value })
                                }
                                placeholder={"Some Title"}
                            />
                        </Form.Item>
                        <Form.Item
                            name="content"
                            label="Content"
                            rules={[
                                {
                                    required: true,
                                    message: "Please insert the content"
                                }
                            ]}
                            wrapperCol={{ sm: 24 }}
                            style={{
                                width: "100%"
                            }}
                        >
                            <div className="ant-input">
                                <Editor
                                    placeholder="Claim"
                                    editorState={this.state.editorState}
                                    onChange={this.onChange}
                                />
                            </div>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Save
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        );
    }
}

export default ClaimCreate;
