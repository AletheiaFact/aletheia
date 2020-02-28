import React, { Component } from "react";
import ClaimParagraph from "./ClaimParagraph";
import ClaimReviewForm from "./ClaimReview";
import axios from "axios";
import { Container, Row, Col } from "reactstrap";

import { Heading } from "grommet";

class Claim extends Component {
    componentDidMount() {
        const self = this;
        self.getClaim();
    }

    getClaim() {
        console.log(this.props);
        axios
            .get(
                `${process.env.API_URL}/claim/${this.props.match.params.claimId}`
            )
            .then(response => {
                console.log(response.data);
                const { content, title } = response.data;
                this.setState({ title, body: content.object, highlight: {} });
            })
            .catch(() => {
                console.log("Error while fetching claim");
            });
    }

    handleClaimReviewForm = data => {
        const body = this.state.body;
        const highlight = {
            ...data,
            claim: this.props.match.params.claimId,
            personality: this.props.match.params.id
        };
        this.setState({ body, highlight });
    };

    render() {
        if (this.state && this.state.body) {
            const body = this.state.body;
            const title = this.state.title;
            return (
                <Container>
                    <Heading>{title}</Heading>
                    <Row>
                        <Col sm={{ size: 8 }}>
                            <div>
                                {body.map(p => (
                                    <ClaimParagraph
                                        key={p.props.id}
                                        paragraph={p}
                                        onClaimReviewForm={
                                            this.handleClaimReviewForm
                                        }
                                    />
                                ))}
                            </div>
                        </Col>
                        <Col sm={{ size: 2 }}>
                            <ClaimReviewForm highlight={this.state.highlight} />
                        </Col>
                    </Row>
                </Container>
            );
        } else {
            return "Loading";
        }
    }
}

export default Claim;
