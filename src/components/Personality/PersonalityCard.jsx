import React, { Component } from "react";
import { Avatar, Spin, Col, Row, Typography, Button } from "antd";
import { withTranslation } from "react-i18next";
import { ArrowRightOutlined } from "@ant-design/icons";

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
        console.log(personality);
        if (personality) {
            return (
                <>
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
                            <Title level={4}>{personality.name}</Title>
                            <Paragraph>{personality.description}</Paragraph>
                            {personality.wikipedia && (
                                <a
                                    className="back-button"
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
                    <hr style={{ opacity: "20%" }} />
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

export default withTranslation()(PersonalityCard);
