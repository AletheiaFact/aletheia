import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import { Avatar, Spin, Table, Col, Row, Typography } from "antd";

const { Title, Paragraph } = Typography;
const { Column } = Table;

class PersonalityCard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const personality = this.props.personality;

        if (personality) {
            return (
                <>
                    <Row style={{ padding: "10px 30px", marginTop: "10px" }}>
                        <Col span={6}>
                            <Avatar size={90} src={personality.image} />
                        </Col>
                        <Col span={3}></Col>
                        <Col span={15}>
                            <Title level={4}>{personality.name}</Title>
                            <Paragraph ellipsis={{ rows: 1, expandable: true }}>
                                {personality.description}
                            </Paragraph>
                        </Col>
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

export default PersonalityCard;
