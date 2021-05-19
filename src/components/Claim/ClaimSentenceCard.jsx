import { Avatar, Button, Col, Comment, Row, Tooltip, Typography } from "antd";
import React, { Component } from "react";
import "./ClaimCard.less";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ReviewColors from "../../constants/reviewColors";

const { Paragraph } = Typography;
class ClaimCard extends Component {
    render() {
        const content = this.props.sentence?.content;
        if (content) {
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
                                            {content}
                                        </Paragraph>
                                    </Col>
                                </Row>
                            </>
                        }
                        datetime={
                            <Tooltip title={this.props.sentence?.date}>
                                <span>{this.props.sentence?.date}</span>
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
