import { Avatar, Button, Col, Comment, Row, Tooltip, Typography } from "antd";
import React, { Component } from "react";
import "./ClaimCard.less";
import api from "../../api/claim";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ReviewColors from "../../constants/reviewColors";

const { Paragraph } = Typography;
class ClaimCard extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    async componentDidMount() {
        const claim = await api.getById(this.props.claim._id);
        const self = this;
        this.setState(
            {
                claim: Object.assign(claim, {
                    content: this.props.claim.content
                })
            },
            () => {
                console.log(self.state.claim);
            }
        );
    }
    render() {
        const { t } = this.props;
        const review = this.state.claim?.stats?.reviews[0];
        if (this.state.claim) {
            return (
                <Col span={24}>
                    <Comment
                        review="true"
                        key={this.props.claimIndex}
                        author={this.props.personality.name}
                        avatar={
                            <Avatar
                                src={this.props.personality.image}
                                alt={this.props.personality.name}
                            />
                        }
                        content={
                            <>
                                <Row className="claim-summary">
                                    <Col>
                                        <Paragraph
                                            ellipsis={{
                                                rows: 4,
                                                expandable: false
                                            }}
                                        >
                                            "
                                            {this.state.claim.content ||
                                                this.state.claim.title}
                                            "
                                        </Paragraph>
                                        <Link
                                            to={location =>
                                                this.props.viewClaim(
                                                    this.state.claim._id,
                                                    true
                                                )
                                            }
                                            style={{
                                                textDecoration: "underline"
                                            }}
                                        >
                                            {t("claim:cardLinkToFullText")}
                                        </Link>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={16}>
                                        <span
                                            style={{
                                                fontSize: "14px"
                                            }}
                                        >
                                            {t("claim:metricsHeaderInfo", {
                                                totalReviews: this.state.claim
                                                    ?.stats?.total
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
                                                <span
                                                    style={{
                                                        color:
                                                            ReviewColors[
                                                                review?._id
                                                            ] || "#000",
                                                        fontWeight: "bold",
                                                        textTransform:
                                                            "uppercase"
                                                    }}
                                                >
                                                    {t(
                                                        `claimReviewForm:${review?._id}`
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
                                            onClick={e => {
                                                e.stopPropagation();
                                                this.props.viewClaim(
                                                    this.state.claim._id
                                                );
                                            }}
                                        >
                                            {t("claim:cardReviewButton")}
                                        </Button>
                                    </Col>
                                </Row>
                            </>
                        }
                        datetime={
                            <Tooltip title={this.state.claim?.date}>
                                <span>{this.state.claim?.date}</span>
                            </Tooltip>
                        }
                    />
                    <hr style={{ opacity: "20%" }} />
                </Col>
            );
        } else {
            return <div></div>;
        }
    }
}

export default withTranslation()(ClaimCard);
