import React, { Component } from 'react'
import axios from 'axios'
import { Header, Icon, Button, Table } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap'

class PersonalityView extends Component {

    constructor(props){
        super(props);
        this.createClaim = this.createClaim.bind(this);
        this.viewClaim = this.viewClaim.bind(this);
        this.state = {};
    }

    componentDidMount(){
        const self = this;
        self.getPersonality();
    }

    getPersonality() {
        axios.get(`http://localhost:3000/personality/${this.props.match.params.id}`)
        .then(response => {
            const personality = response.data;
            this.setState({ personality });
        })
        .catch(() => { console.log('Error while fetching Personality'); })
    }

    createClaim() {
        let path = `./${this.props.match.params.id}/claim/create`;
        this.props.history.push(path);
    }

    viewClaim(id) {
        let path = `./${this.props.match.params.id}/claim/${id}`;
        this.props.history.push(path);
    }

    render() {
        let personality = this.state.personality
        if (personality) {
            const review = personality.stats.reviews.map( review => (
                <li>{review._id}: {review.percentage}</li>)
            )
            return (
                <div>
                    <Header icon textAlign='center'>
                        <Row>
                            <Col as='h2' sm={{ size:6, offset:2 }}>
                                <Icon name='user' circular />
                                <Header.Content>{personality.name}</Header.Content>
                                <Header.Subheader>{personality.bio}</Header.Subheader>
                            </Col>
                            <Col>
                                # of reviews {personality.stats.total}
                                <ul>
                                    {review}
                                </ul>
                            </Col>
                        </Row>
                    </Header>
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Claim Title</Table.HeaderCell>
                                <Table.HeaderCell />
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {personality.claims.map(claim => (
                                <Table.Row>
                                    <Table.Cell>{claim.title}</Table.Cell>
                                    <Table.Cell><Button onClick={() => this.viewClaim(claim._id)}>View</Button></Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                        <Table.Footer>
                            <Table.Row>
                                <Table.HeaderCell>
                                    <Button onClick={() => this.createClaim()}>Add Claim</Button>
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