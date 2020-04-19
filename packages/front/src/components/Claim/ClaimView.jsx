import axios from "axios";
import React, { Component } from "react";
import ClaimParagraph from "./ClaimParagraph";
import ClaimReviewForm from "./ClaimReview";
import { Row, Col, Typography } from "antd";

const { Title } = Typography;

class Claim extends Component {
    componentDidMount() {
        const self = this;
        self.getClaim();
    }

    getClaim() {
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
                <>
                    <Title>{title}</Title>
                    <Row>
                        <Col span={16}>
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
                        <Col span={4}>
                            <ClaimReviewForm highlight={this.state.highlight} />
                        </Col>
                    </Row>
                </>
            );
        } else {
            return "Loading";
        }
    }
}

export default Claim;
