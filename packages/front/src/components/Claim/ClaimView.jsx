import React, { Component } from 'react'
import ClaimParagraph from './ClaimParagraph'
import ClaimReviewForm from './ClaimReview'
import axios from 'axios'
import { Container, Row, Col } from 'reactstrap'

class Claim extends Component {

    componentDidMount() {
        const self = this;
        self.getClaim();
    }

    getClaim() {
        console.log(this.props);
      axios.get(`http://localhost:3000/claim/${this.props.match.params.claimId}`)
      .then(response => {
            const content = response.data.content.object;
            this.setState({ body: content, highlight: {} });
        })
        .catch(() => { console.log('Error while fetching claim'); })
    }

    handleClaimReviewForm = (data) => {
        let body = this.state.body;
        let highlight = {
            ...data,
            claim: this.props.match.params.claimId,
            personality: this.props.match.params.id,
        };
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
                                    <ClaimParagraph 
                                        key={p.props.id}
                                        paragraph={p} 
                                        onClaimReviewForm={this.handleClaimReviewForm}
                                    />
                                ))}
                            </div>
                        </Col>
                        <Col sm={{ size:2 }}>
                            <ClaimReviewForm 
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
 
export default Claim;