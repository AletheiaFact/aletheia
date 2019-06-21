import React, { Component } from 'react'
import axios from 'axios'
import { Header, Icon, Button, Table } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom';

class PersonalityView extends Component {

    constructor(props){
        super(props);
        this.createSpeech = this.createSpeech.bind(this);
        this.viewSpeech = this.viewSpeech.bind(this);
        this.state = {};
    }

    componentDidMount(){
        const self = this;
        self.getPersonality();
    }

    getPersonality () {
        axios.get(`http://localhost:3000/personality/${this.props.match.params.id}`)
        .then(response => {
            const personality = response.data;
            this.setState({ personality });
        })
        .catch(() => { console.log('Error while fetching Personality'); })
    }

    createSpeech() {
        let path = `../speech/create/${this.props.match.params.id}`;
        this.props.history.push(path);
    }

    viewSpeech(id) {
        let path = `../speech/${id}`;
        this.props.history.push(path);
    }

    render() {
        let personality = this.state.personality
        if (personality) {
            return (
                <div>
                    <Header as='h2' icon textAlign='center'>
                        <Icon name='user' circular />
                        <Header.Content>{personality.name}</Header.Content>
                        <Header.Subheader>{personality.bio}</Header.Subheader>
                    </Header>
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Speech Title</Table.HeaderCell>
                                <Table.HeaderCell />
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {personality.speechs.map(speech => (
                                <Table.Row>
                                    <Table.Cell>{speech.title}</Table.Cell>
                                    <Table.Cell><Button onClick={() => this.viewSpeech(speech._id)}>View</Button></Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                        <Table.Footer>
                            <Table.Row>
                                <Table.HeaderCell>
                                    <Button onClick={() => this.createSpeech()}>Add Speech</Button>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Footer>
                    </Table>
                </div>
            );
        } else {
            return ('loading');
        }
    }

}

export default withRouter(PersonalityView);