import { Avatar, Col, Row, Typography } from "antd";
import React from "react";

import CardBase from "../CardBase";
import UserTag from "./UserTag";
import claimApi from "../../api/claim";
import personalityApy from "../../api/personality";
import { useTranslation } from "next-i18next";
import actions from "../../store/actions";
import { useDispatch } from "react-redux";

const { Text, Paragraph } = Typography;

const KanbanCard = ({ reviewTask, userRole, isLoggedIn }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const goToClaimReview = () => {
        dispatch(actions.openReviewDrawer());
        dispatch(actions.setSelectClaim(null));
        dispatch(actions.setSelectPersonality(null));
        dispatch(actions.setSelectSentence(null));
        dispatch(actions.setSelectDataHash(null));
        Promise.all([
            claimApi.getById(reviewTask.claimId, t, {}),
            personalityApy.getPersonality(reviewTask.personalityId, {}, t),
        ]).then(([claim, personality]) => {
            dispatch(actions.setSelectClaim(claim));
            dispatch(actions.setSelectPersonality(personality));
            dispatch(actions.setSelectSentence(reviewTask?.sentence));
            dispatch(
                actions.setSelectDataHash(reviewTask?.sentence?.data_hash)
            );
        });
    };
    return (
        <a
            onClick={goToClaimReview}
            style={{ width: "100%", minWidth: "330px" }}
        >
            <CardBase
                style={{
                    borderRadius: 4,
                    marginBottom: 0,
                    boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.2)",
                }}
            >
                <Row style={{ width: "100%", padding: "10px" }}>
                    <Col
                        span={24}
                        style={{ display: "flex", flexDirection: "column" }}
                    >
                        <Paragraph
                            ellipsis={{
                                rows: 2,
                                expandable: false,
                            }}
                            style={{
                                fontSize: 14,
                                fontWeight: "bold",
                            }}
                        >
                            {reviewTask?.sentence?.content}
                        </Paragraph>
                        <Text>{reviewTask.personalityName}</Text>
                    </Col>
                    <Col
                        span={24}
                        style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                        <Avatar.Group>
                            {reviewTask.usersName &&
                                reviewTask.usersName.map((user, index) => {
                                    return (
                                        <UserTag
                                            userRole={userRole}
                                            isLoggedIn={isLoggedIn}
                                            user={user}
                                            key={index}
                                        />
                                    );
                                })}
                        </Avatar.Group>
                    </Col>
                </Row>
            </CardBase>
        </a>
    );
};

export default KanbanCard;
