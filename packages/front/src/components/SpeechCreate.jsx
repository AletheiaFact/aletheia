import React, { Component } from 'react'
import axios from 'axios'
import { Container, Form, FormGroup, Input, Label, Button } from 'reactstrap'
import { Editor, EditorState } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'
import 'draft-js/dist/Draft.css';

class SpeechCreate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editorState: EditorState.createEmpty(),
        }

        this.saveSpeech = this.saveSpeech.bind(this);
        this.onChange = (editorState) => this.setState({editorState});
      }

    saveSpeech(e) {
        e.preventDefault();

        const html = stateToHTML(this.state.editorState.getCurrentContent());
        const title = this.state.title;
        const personality = this.props.match.params.personalityId;
        console.log({ title, html, personality });
        axios.post('http://localhost:3000/speech', { title, html, personality })
        .then(response => {
            console.log(response.data)
        })
        .catch(() => { console.log('Erro ao recuperar os dados'); })
    }
  
    render() {
      return (
        <Container>
              <h2><center>Create Speech</center></h2>
              <Form onSubmit={this.saveSpeech}>
                <FormGroup>
                    <Label>Title</Label>
                    <Input
                        value={this.state.title}
                        onChange={e => this.setState({title: e.target.value}) }
                        placeholder={'Some Title'}/>
                </FormGroup>
                <FormGroup>
                    <Label>Speech</Label>
                    <Editor editorState={this.state.editorState} onChange={this.onChange} />
                  
                </FormGroup>
                <Button type="submit" value="Submit">Save</Button>
                
              </Form>
        </Container>
      );
    }
}

export default SpeechCreate;