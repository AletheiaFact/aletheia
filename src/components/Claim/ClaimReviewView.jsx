import React, { Component } from "react";
import claimApi from "../../api/claim";
import personalityApi from "../../api/personality";
import ClaimSentenceCard from "./ClaimSentenceCard";
import { Button, Col, Row } from "antd";
import ClaimReviewForm from "./ClaimReviewForm";
import ReviewColors from "../../constants/reviewColors";
import { withTranslation } from "react-i18next";

class ClaimReviewView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formCollapsed: true
        };
    }

    showModal = () => {
        this.setState({
            formCollapsed: false
        });
    };

    handleOk = () => {
        this.setState({
            formCollapsed: true
        });
    };

    handleCancel = () => {
        this.setState({
            formCollapsed: true
        });
    };

    async componentDidMount() {
        const {
            personalityId,
            claimId,
            sentenceHash
        } = this.props.match.params;
        const personality = await personalityApi.getPersonality(personalityId);
        const sentence = await claimApi.getClaimSentence(claimId, sentenceHash);
        this.setState({
            personality,
            sentence
        });
    }

    render() {
        const { personality, sentence } = this.state;
        const { t } = this.props;
        const { personalityId, claimId } = this.props.match.params;
        const stats = sentence?.stats;
        const review = sentence?.props?.topClassification;
        if (personality && sentence) {
            return (
                <>
                    <Row>
                        <ClaimSentenceCard
                            personality={personality}
                            sentence={sentence}
                        />
                    </Row>

                    {this.state.formCollapsed && (
                        <Row>
                            <Col span={16}>
                                <span
                                    style={{
                                        fontSize: "14px"
                                    }}
                                >
                                    {t("claim:metricsHeaderInfo", {
                                        totalReviews: stats?.total
                                    })}
                                </span>{" "}
                                <br />
                                {review && (
                                    <span
                                        style={{
                                            fontSize: "10px"
                                        }}
                                    >
                                        {t("claim:cardOverallReviewPrefix")}{" "}
                                        <span
                                            style={{
                                                color:
                                                    ReviewColors[
                                                        review?.classification
                                                    ] || "#000",
                                                fontWeight: "bold",
                                                textTransform: "uppercase"
                                            }}
                                        >
                                            {t(
                                                `claimReviewForm:${review?.classification}`
                                            )}{" "}
                                        </span>
                                        ({review.count})
                                    </span>
                                )}
                            </Col>

                            <Col span={8}>
                                <Button
                                    shape="round"
                                    type="primary"
                                    onClick={this.showModal}
                                >
                                    Review
                                </Button>
                            </Col>
                        </Row>
                    )}
                    {!this.state.formCollapsed && (
                        <Row>
                            <ClaimReviewForm
                                claimId={claimId}
                                personalityId={personalityId}
                                handleOk={this.handleOk}
                                handleCancel={this.handleCancel}
                                highlight={sentence}
                            />
                        </Row>
                    )}
                </>
            );
        } else {
            return <></>;
        }
    }
}

export default withTranslation()(ClaimReviewView);
