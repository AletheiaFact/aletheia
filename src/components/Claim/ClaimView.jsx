import axios from "axios";
import React, { Component } from "react";
import ClaimParagraph from "./ClaimParagraph";
import ClaimReviewForm from "./ClaimReview";
import { Row, Col, Typography, Modal, message, Spin, Affix } from "antd";
import PersonalityCard from "../Personality/PersonalityCard";
import { withTranslation } from "react-i18next";
import MetricsOverview from "../Metrics/MetricsOverview";
import ToggleSection from "../ToggleSection";
import moment from "moment";
import "moment/locale/pt";
import SocialMediaShare from "../SocialMediaShare";

const { Title } = Typography;

class Claim extends Component {
    constructor(props) {
        super(props);
        moment.locale(props.i18n.language);

        this.state = {
            stats: {},
            showHighlights: true
        };
    }
    componentDidMount() {
        const self = this;
        self.getClaim();
        self.getPersonality();
        // @TODO i18n
        message.info("Clique em uma frase para iniciar uma revisão");
    }

    getClaim() {
        axios
            .get(
                `${process.env.API_URL}/claim/${this.props.match.params.claimId}`
            )
            .then(response => {
                const { content, title, stats, date, type } = response.data;

                this.setState({
                    title,
                    body: content.object,
                    stats,
                    date: moment(new Date(date)),
                    type,
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
        this.setState({
            visible: false
        });
    };

    handleCancel = e => {
        this.setState({
            visible: false
        });
    };

    render() {
        const { t } = this.props;
        if (this.state && this.state.body) {
            const body = this.state.body;
            const title = this.state.title;
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
                        <>
                            <PersonalityCard personality={personality} />
                            {this.state.date && (
                                <Row style={{ marginTop: "20px" }}>
                                    <Col offset={2} span={18}>
                                        <b>{personality.name}</b><br/>
                                        {t("claim:info", {
                                            claimDate: this.state.date.format(
                                                "L"
                                            )
                                        })}
                                    </Col>
                                </Row>
                            )}
                        </>
                    )}
                    <Row
                        style={{
                            background: "#F5F5F5",
                            boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.15)",
                            borderRadius: "30px 30px 0px 0px",
                            margin: "15px -15px 15px -15px",
                            paddingBottom: "15px"
                        }}
                    >
                        <Row style={{ marginTop: "20px", width: "100%" }}>
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
                                            showHighlights={
                                                this.state.showHighlights
                                            }
                                            onClaimReviewForm={
                                                this.handleClaimReviewForm
                                            }
                                        />
                                    ))}
                                </div>
                            </Col>
                        </Row>
                        <Affix
                            offsetBottom={15}
                            style={{
                                textAlign: "center",
                                width: "100%"
                            }}
                        >
                            <ToggleSection
                                defaultValue={this.state.showHighlights}
                                onChange={e => {
                                    this.setState({
                                        showHighlights: e.target.value
                                    });
                                }}
                                labelTrue={t("claim:showHighlightsButton")}
                                labelFalse={t("claim:hideHighlightsButton")}
                            />
                        </Affix>
                    </Row>
                    {this.state.stats.total !== 0 && (
                        <MetricsOverview stats={this.state.stats} />
                    )}
                    <SocialMediaShare quote={personality.name} />
                </>
            );
        } else {
            return (
                <Spin
                    tip={t("global:loading")}
                    style={{
                        textAlign: "center",
                        position: "absolute",
                        top: "50%",
                        left: "calc(50% - 40px)"
                    }}
                ></Spin>
            );
        }
    }
}

export default withTranslation()(Claim);
