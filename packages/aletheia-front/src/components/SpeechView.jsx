import React, { Component } from 'react'
import Paragraph from './speech/paragraph'
import CheckingForm from './speech/checking'
import axios from 'axios'
import { Container, Row, Col } from 'reactstrap'
import createStore from 'redux'

class Speech extends Component {

    componentDidMount() {
        const self = this;
        self.getSpeech();
    }

    getSpeech() {
      axios.get(`http://localhost:3000/speech/${this.props.match.params.id}`)
        .then(response => {
            const content = response.data.content.object;
            this.setState({ body: content, highlight: {} });
        })
        .catch(() => { console.log('Error while fetching speech'); })
    }

    handleCheckingForm = (data) => {
        let body = this.state.body;
        let highlight = data;
        this.setState({ body, highlight });
    }

    render() { 
        if (this.state && this.state.body)
        {   
            const body = this.state.body
            return (
                <Container>
                    <Row>
                        <Col sm={{ size:8 }}>
                            <div>
                                {body.map(p => (
                                    <Paragraph 
                                        key={p.props.id}
                                        paragraph={p} 
                                        onCheckingForm={this.handleCheckingForm}
                                    />
                                ))}
                            </div>
                        </Col>
                        <Col sm={{ size:2 }}>
                            <CheckingForm 
                                highlight={this.state.highlight}
                            />
                        </Col>
                    </Row>
                </Container>
            )
        } else {
            return 'Loading'
        }
    }
}
 
export default Speech;