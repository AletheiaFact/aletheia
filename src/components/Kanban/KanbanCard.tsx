import { Col, Row, Typography } from "antd";
import Link from "next/link";
import React from "react";
import colors from "../../styles/colors";

import CardBase from "../CardBase";

const { Text } = Typography

const KanbanCard = ({ reviewTask }) => {

    return (
        <CardBase style={{ width: '100%', minWidth: '300px' }}>
            <Row style={{ width: '100%', padding: "10px" }}>
                <Col span={24} style={{ display: 'flex', flexDirection: 'column' }}>
                    <strong
                        style={{
                            fontSize: 14,
                        }}
                    >
                        {reviewTask.claimTitle}
                    </strong>
                    <Text
                    >
                        claim by {reviewTask.personalityName}
                    </Text>
                    <Text
                        style={{
                            fontSize: 12,
                            width: "100%",
                        }}
                    >
                        Assigned to {reviewTask.userName}
                    </Text>
                    <Link href={reviewTask.reviewHref} passHref>
                        <Text
                            style={{
                                color: colors.bluePrimary,
                                fontWeight: 'bold',
                                fontSize: 12,
                                textDecoration: "underline",
                                cursor: "pointer",
                                textAlign: "right"
                            }}

                        >
                            #{reviewTask.sentence_hash}
                        </Text>
                    </Link>
                </Col>
            </Row>
        </CardBase>
    );
}

export default KanbanCard;
