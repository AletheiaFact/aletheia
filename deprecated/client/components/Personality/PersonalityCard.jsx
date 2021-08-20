import React, { Component } from "react";
import { Avatar, Spin, Col, Row, Typography, Button } from "antd";
import { withTranslation } from "react-i18next";
import { ArrowRightOutlined } from "@ant-design/icons";
import ReviewStats from "../Metrics/ReviewStats";

const { Title, Paragraph } = Typography;

class PersonalityCard extends Component {
    constructor(props) {
        super(props);
        if (this.props.summarized) {
            this.titleSpan = 13;
            this.avatarSpan = 2;
            this.avatarSize = 45;
        } else {
            this.titleSpan = 15;
            this.avatarSpan = 6;
            this.avatarSize = 90;
        }
    }

    render() {
        const { personality, t } = this.props;

        if (personality) {
            return (
                <Row
                    style={{
                        width: "100%"
                    }}
                >
                    <Row
                        style={{
                            padding: "10px 30px",
                            marginTop: "10px",
                            width: "100%"
                        }}
                    >
                        <Col span={this.avatarSpan}>
                            <Avatar
                                size={this.avatarSize}
                                src={personality.image}
                            />
                        </Col>
                        <Col span={3}></Col>
                        <Col span={this.titleSpan}>
                            <Title level={4} style={{ marginBottom: 0 }}>
                                {personality.name}
                            </Title>
                            <Paragraph
                                style={
                                    this.props.summarized && {
                                        fontSize: "12px"
                                    }
                                }
                            >
                                {personality.description}
                            </Paragraph>
                            {this.props.summarized &&
                                personality.stats?.total !== undefined && (
                                    <Paragraph
                                        style={{
                                            fontSize: "12px"
                                        }}
                                    >
                                        <b>
                                            {t(
                                                "personality:headerReviewsTotal",
                                                {
                                                    totalReviews:
                                                        personality.stats?.total
                                                }
                                            )}
                                        </b>
                                    </Paragraph>
                                )}
                            {!this.props.summarized && personality.wikipedia && (
                                <a
                                    style={{
                                        fontWeight: "bold"
                                    }}
                                    target="_blank"
                                    href={personality.wikipedia}
                                >
                                    {t("personality:wikipediaPage")}{" "}
                                    <ArrowRightOutlined />
                                </a>
                            )}
                        </Col>
                        {this.props.summarized && (
                            <Col span={6}>
                                {personality._id ? (
                                    <Button
                                        type={
                                            this.props.suggestion
                                                ? ""
                                                : "primary"
                                        }
                                        href={`${this.props.hrefBase ||
                                            "personality/"}${personality._id}`}
                                    >
                                        {t("personality:profile_button")}
                                    </Button>
                                ) : (
                                    <Button
                                        type="primary"
                                        onClick={() =>
                                            this.props.onClick(personality)
                                        }
                                    >
                                        + {t("personality:add_button")}
                                    </Button>
                                )}
                            </Col>
                        )}
                    </Row>
                    {!this.props.summarized && (
                        <hr style={{ opacity: "20%" }} />
                    )}
                    <Row style={{ padding: "5px 30px", width: "100%" }}>
                        {!this.props.summarized && (
                            <Row
                                style={{
                                    width: "100%",
                                    flexDirection: "column",
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    color: "#262626",
                                    padding: "10px 0 25px 0px"
                                }}
                            >
                                {personality.claims.length !== undefined && (
                                    <span>
                                        <span
                                            style={{
                                                color: "#70b0d6",
                                                fontSize: "20px"
                                            }}
                                        >
                                            {personality.claims.length}
                                        </span>{" "}
                                        {t("personality:headerClaimsTotal")}
                                    </span>
                                )}
                                {personality.stats?.total && (
                                    <span>
                                        <span
                                            style={{
                                                color: "#70b0d6",
                                                fontSize: "20px"
                                            }}
                                        >
                                            {t(
                                                "personality:headerReviewsTotal",
                                                {
                                                    totalReviews:
                                                        personality.stats?.total
                                                }
                                            )}
                                        </span>
                                    </span>
                                )}
                            </Row>
                        )}
                        <Row
                            style={{
                                justifyContent: "space-between",
                                width: "100%"
                            }}
                        >
                            <ReviewStats
                                stats={personality.stats}
                                type="circle"
                                format="count"
                                width={this.props.summarized && 30}
                                showInfo={!this.props.summarized}
                                strokeWidth="16"
                            />
                        </Row>
                    </Row>
                    <hr style={{ opacity: "20%" }} />
                </Row>
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

export default withTranslation()(PersonalityCard);
