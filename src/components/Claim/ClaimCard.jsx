import { Avatar, Button, Col, Comment, Row, Tooltip, Typography } from "antd";
import React from "react";
import "./ClaimCard.less";

const { Paragraph } = Typography;
function ClaimCard(props) {
    return (
        <Col span={24}>
            <Comment
                style={{ margin: "0 20px" }}
                key={props.claimIndex}
                author={props.personality.name}
                avatar={
                    <Avatar
                        src={props.personality.image}
                        alt={props.personality.name}
                    />
                }
                content={
                    <>
                        <Row className="claim-summary">
                            <Col>
                                <Paragraph
                                    ellipsis={{ rows: 4, expandable: false }}
                                >
                                    "{props.claim.content || props.claim.title}"
                                </Paragraph>
                            </Col>
                        </Row>
                        <Row>
                            <Col offset={16}>
                                <Button
                                    shape="round"
                                    type="primary"
                                    onClick={e => {
                                        e.stopPropagation();
                                        props.viewClaim(props.claim._id);
                                    }}
                                >
                                    Revisar
                                </Button>
                            </Col>
                        </Row>
                    </>
                }
                datetime={
                    <Tooltip title="01/2020">
                        <span>há 5 meses</span>
                    </Tooltip>
                }
            />
            <hr style={{ opacity: "20%" }} />
        </Col>
    );
}

export default ClaimCard;
