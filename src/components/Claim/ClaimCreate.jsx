import React, { Component } from "react";
import { Editor, EditorState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { stateFromHTML } from "draft-js-import-html";
import "draft-js/dist/Draft.css";
import { Typography, Form, Input, Button, Row, Col } from "antd";
import api from "../../api/claim";

const { Title } = Typography;
class ClaimCreate extends Component {
    formRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            title: "",
            editorState: EditorState.createEmpty()
        };
        this.saveClaim = this.saveClaim.bind(this);
        this.updateClaim = this.updateClaim.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    async componentDidMount() {
        if (this.props.edit) {
            const { content, title } = await api.getById(
                this.props.match.params.claimId
            );
            const editorState = EditorState.createWithContent(
                stateFromHTML(content.html)
            );
            this.setState(
                {
                    title,
                    editorState,
                    content: stateToHTML(
                        this.state.editorState.getCurrentContent()
                    )
                },
                () => {
                    this.formRef.current.setFieldsValue({
                        title,
                        content: this.state.content
                    });
                }
            );
        }
    }

    async saveClaim() {
        const _id = await api.save({
            content: stateToHTML(this.state.editorState.getCurrentContent()),
            title: this.state.title,
            personality: this.props.match.params.id
        });
        // Redirect to personality profile in case _id is not present
        const path = _id ? `./${_id}` : "../";
        this.props.history.push(path);
    }

    async updateClaim() {
        await api.update(this.props.match.params.claimId, {
            title: stateToHTML(this.state.editorState.getCurrentContent()),
            content: this.state.title
        });
        // Redirect to personality profile in case _id is not present
        const path = "./";
        this.props.history.push(path);
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
            <>
                <Row gutter={[32, 0]}>
                    <Col span={24}>
                        <Title level={2}>
                            <center>Create Claim</center>
                        </Title>
                        <Form
                            ref={this.formRef}
                            id="createClaim"
                            onFinish={
                                this.props.edit
                                    ? this.updateClaim
                                    : this.saveClaim
                            }
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
                                    value={this.state?.title || ""}
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
                                        editorState={this.state?.editorState}
                                        onChange={this.onChange}
                                    />
                                </div>
                            </Form.Item>
                            <Form.Item>
                                {this.props.edit ? (
                                    <Button type="primary" htmlType="submit">
                                        Update
                                    </Button>
                                ) : (
                                    <Button type="primary" htmlType="submit">
                                        Save
                                    </Button>
                                )}
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </>
        );
    }
}

export default ClaimCreate;
