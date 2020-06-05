import React, { Component } from "react";
import { Avatar, Spin, Col, Row, Typography, Button } from "antd";
import { withTranslation } from "react-i18next";

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
                <>
                    <Row style={{ padding: "10px 30px", marginTop: "10px" }}>
                        <Col span={this.avatarSpan}>
                            <Avatar
                                size={this.avatarSize}
                                src={personality.image}
                            />
                        </Col>
                        <Col span={3}></Col>
                        <Col span={this.titleSpan}>
                            <Title level={4}>{personality.name}</Title>
                            <Paragraph ellipsis={{ rows: 1, expandable: true }}>
                                {personality.description}
                            </Paragraph>
                        </Col>
                        {this.props.summarized && (
                            <Col span={6}>
                                <Button
                                    type="primary"
                                    href={`personality/${personality._id}`}
                                >
                                    {t("personality:profile_button")}
                                </Button>
                            </Col>
                        )}
                    </Row>
                    <hr style={{ opacity: "20%" }} />
                </>
            );
        } else {
            return (
                <Spin
                    tip="Loading..."
                    style={{
                        textAlign: "center",
                        position: "absolute",
                        top: "50%",
                        width: "100%"
                    }}
                ></Spin>
            );
        }
    }
}

export default withTranslation()(PersonalityCard);
