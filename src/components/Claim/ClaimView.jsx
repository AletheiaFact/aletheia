import axios from "axios";
import React, { Component } from "react";
import ClaimParagraph from "./ClaimParagraph";
import ClaimReviewForm from "./ClaimReview";
import { Row, Col, Typography, Modal, message } from "antd";
import PersonalityCard from "../Personality/PersonalityCard";
import { withTranslation } from "react-i18next";

const { Title } = Typography;

class Claim extends Component {
    componentDidMount() {
        const self = this;
        self.getClaim();
        self.getPersonality();
        message.info("Clique em uma frase para iniciar uma revisão");
    }

    getClaim() {
        axios
            .get(
                `${process.env.API_URL}/claim/${this.props.match.params.claimId}`
            )
            .then(response => {
                const { content, title } = response.data;
                this.setState({
                    title,
                    body: content.object,
                    highlight: {},
                    visible: false
                });
            })
            .catch(() => {
                console.log("Error while fetching claim");
            });
    }

    getPersonality() {
        axios
            .get(
                `${process.env.API_URL}/personality/${this.props.match.params.id}`,
                {
                    params: {
                        language: this.props.i18n.languages[0]
                    }
                }
            )
            .then(response => {
                const personality = response.data;
                this.setState({ personality });
            })
            .catch(() => {
                console.log("Error while fetching Personality");
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
        this.showModal();
    };

    showModal = () => {
        this.setState({
            visible: true
        });
    };

    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false
        });
    };

    render() {
        if (this.state && this.state.body) {
            const body = this.state.body;
            const title = this.state.title;
            const visible = this.state.visible;
            const personality = this.state.personality;

            return (
                <>
                    <Modal
                        footer=""
                        visible={this.state.visible}
                        onCancel={this.handleCancel}
                    >
                        <ClaimReviewForm
                            handleOk={this.handleOk}
                            highlight={this.state.highlight}
                        />
                    </Modal>
                    {personality && (
                        <PersonalityCard personality={personality} />
                    )}

                    <Row style={{ marginTop: "20px" }}>
                        <Col offset={2} span={18}>
                            <Title level={4}>{title}</Title>
                        </Col>
                    </Row>
                    <Row>
                        <Col offset={2} span={18}>
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
                    </Row>
                </>
            );
        } else {
            return "Loading";
        }
    }
}

export default withTranslation()(Claim);
