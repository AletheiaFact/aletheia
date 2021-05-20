import React, { Component } from "react";
import claimApi from "../../api/claim";
import personalityApi from "../../api/personality";
import ClaimSentenceCard from "./ClaimSentenceCard";
import { Button, Col, Row } from "antd";
import ClaimReviewForm from "./ClaimReviewForm";
import { withTranslation } from "react-i18next";
import ClaimReviewList from "./ClaimReviewList";
import ClassificationText from "../ClassificationText";

class ClaimReviewView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formCollapsed: true
        };
    }

    toggleFormCollapse = () => {
        this.setState({
            formCollapsed: !this.state.formCollapsed
        });
    };

    async componentDidMount() {
        const {
            personalityId,
            claimId,
            sentenceHash
        } = this.props.match.params;
        const personality = await personalityApi.getPersonality(personalityId, {
            language: this.props.i18n.languages[0]
        });
        const sentence = await claimApi.getClaimSentence(claimId, sentenceHash);
        this.setState({
            personality,
            sentence
        });
    }

    render() {
        const { personality, sentence } = this.state;
        const { t } = this.props;
        const {
            personalityId,
            claimId,
            sentenceHash
        } = this.props.match.params;
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
                    {sentence.userReview && (
                        <Row
                            style={{
                                justifyContent: "center"
                            }}
                        >
                            <div>
                                {t("claimReview:userReviewPrefix")}&nbsp;
                                <ClassificationText
                                    classification={
                                        sentence.userReview?.classification
                                    }
                                    t={t}
                                />
                            </div>
                            <div>
                                {t("claimReview:userReviewSuffix", {
                                    count: review.count
                                })}
                                &nbsp;
                                <ClassificationText
                                    classification={review?.classification}
                                    t={t}
                                />
                            </div>
                        </Row>
                    )}
                    {this.state.formCollapsed && (
                        <Row>
                            {!sentence.userReview && (
                                <>
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
                                                {t(
                                                    "claim:cardOverallReviewPrefix"
                                                )}{" "}
                                                <ClassificationText
                                                    classification={
                                                        review?.classification
                                                    }
                                                    t={t}
                                                />
                                                ({review.count})
                                            </span>
                                        )}
                                    </Col>
                                    <Col span={8}>
                                        <Button
                                            shape="round"
                                            type="primary"
                                            onClick={this.toggleFormCollapse}
                                        >
                                            Review
                                        </Button>
                                    </Col>
                                </>
                            )}
                        </Row>
                    )}
                    {!this.state.formCollapsed && (
                        <Row>
                            <ClaimReviewForm
                                claimId={claimId}
                                personalityId={personalityId}
                                handleOk={this.toggleFormCollapse}
                                handleCancel={this.toggleFormCollapse}
                                highlight={sentence}
                            />
                        </Row>
                    )}
                    <Row>
                        <ClaimReviewList
                            sentenceHash={sentenceHash}
                            claimId={claimId}
                        />
                    </Row>
                </>
            );
        } else {
            return <></>;
        }
    }
}

export default withTranslation()(ClaimReviewView);
