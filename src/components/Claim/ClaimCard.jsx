import { Avatar, Button, Col, Comment, Row, Tooltip } from "antd";
import React from "react";

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
                        <Row>
                            <Col>
                                <p>{props.claim.title}</p>
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
