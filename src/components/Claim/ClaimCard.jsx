import { Avatar, Button, Col, Comment, Row, Tooltip, Typography } from "antd";
import React, { Component } from "react";
import "./ClaimCard.less";
import api from "../../api/claim";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ReviewColors from "../../constants/reviewColors";

const { Paragraph } = Typography;
class ClaimCard extends Component {
    render() {
        const { t } = this.props;
        const review = this.props.claim?.stats?.reviews[0];
        if (this.props.claim) {
            return (
                <Col span={24}>
                    <Comment
                        review="true"
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
                                            {this.props.claim.content.text ||
                                                this.props.claim.title}
                                            "
                                        </Paragraph>
                                        <Link
                                            to={location =>
                                                this.props.viewClaim(
                                                    this.props.claim._id,
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
                                                totalReviews: this.props.claim
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
                                                    this.props.claim._id
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
                            <Tooltip title={this.props.claim?.date}>
                                <span>{this.props.claim?.date}</span>
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
