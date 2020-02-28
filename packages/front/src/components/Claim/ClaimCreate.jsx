import React, { Component } from "react";
import axios from "axios";
import { Container, Form, FormGroup, Input, Label, Button } from "reactstrap";
import { Editor, EditorState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import "draft-js/dist/Draft.css";

class ClaimCreate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editorState: EditorState.createEmpty()
        };
        this.saveClaim = this.saveClaim.bind(this);
        this.onChange = editorState => this.setState({ editorState });
    }

    saveClaim(e) {
        e.preventDefault();
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

    render() {
        return (
            <Container>
                <h2>
                    <center>Create Claim</center>
                </h2>
                <Form onSubmit={this.saveClaim}>
                    <FormGroup>
                        <Label>Title</Label>
                        <Input
                            value={this.state.title || ""}
                            onChange={e =>
                                this.setState({ title: e.target.value })
                            }
                            placeholder={"Some Title"}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Claim</Label>
                        <Editor
                            editorState={this.state.editorState}
                            onChange={this.onChange}
                        />
                    </FormGroup>
                    <Button type="submit" value="Submit">
                        Save
                    </Button>
                </Form>
            </Container>
        );
    }
}

export default ClaimCreate;
