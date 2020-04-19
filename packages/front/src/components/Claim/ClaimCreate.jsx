import React, { Component } from "react";
import axios from "axios";
import { Editor, EditorState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import "draft-js/dist/Draft.css";
import { Typography, Form, Input, Button } from "antd";

const { Title } = Typography;
class ClaimCreate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editorState: EditorState.createEmpty()
        };
        this.saveClaim = this.saveClaim.bind(this);
        this.onChange = editorState => this.setState({ editorState });
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
                console.log(response.data);
            })
            .catch(() => {
                console.log("Error while saving claim");
            });
    }

    onFinishFailed(errorInfo) {
        console.log("Failed:", errorInfo);
    }

    render() {
        return (
            <>
                <Title level={2}>
                    <center>Create Claim</center>
                </Title>
                <Form
                    onFinish={this.saveClaim}
                    onFinishFailed={this.onFinishFailed}
                >
                    <Form.Item>
                        <Input
                            value={this.state.title || ""}
                            onChange={e =>
                                this.setState({ title: e.target.value })
                            }
                            placeholder={"Some Title"}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Editor
                            placeholder="Claim"
                            editorState={this.state.editorState}
                            onChange={this.onChange}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Save
                        </Button>
                    </Form.Item>
                </Form>
            </>
        );
    }
}

export default ClaimCreate;
