import { Avatar, Col, Row, Typography } from "antd";
import React from "react";

import CardBase from "../CardBase";
import UserTag from "./UserTag";
import claimApi from "../../api/claim";
import personalityApy from "../../api/personality";
import { useTranslation } from "next-i18next";
import actions from "../../store/actions";
import { useDispatch } from "react-redux";
import { ContentModelEnum } from "../../types/enums";
import PhotoOutlinedIcon from "@mui/icons-material/PhotoOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";

const { Text, Paragraph } = Typography;

const KanbanCard = ({ reviewTask }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [nameSpace] = useAtom(currentNameSpace);
    const goToClaimReview = () => {
        dispatch(actions.setSelectClaim(null));
        dispatch(actions.setSelectPersonality(null));
        dispatch(actions.setSelectContent(null));
        Promise.all([
            claimApi.getById(reviewTask.claimId, t, {}, nameSpace),
            personalityApy.getPersonality(reviewTask.personalityId, {}, t),
        ]).then(([claim, personality]) => {
            dispatch(actions.setSelectClaim(claim));
            dispatch(actions.setSelectPersonality(personality));
            dispatch(actions.setSelectContent(reviewTask?.content));
        });
        dispatch(actions.openReviewDrawer());
    };

    const goToClaimReviewWithKeyboard = (event) => {
        if (event.key === "Enter") {
            goToClaimReview();
        }
    };

    const isImage = reviewTask.contentModel === ContentModelEnum.Image;
    const title = isImage ? reviewTask.claimTitle : reviewTask.content.content;

    return (
        <a
            onClick={goToClaimReview}
            onKeyUp={goToClaimReviewWithKeyboard}
            tabIndex={0}
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
                            {title}
                        </Paragraph>
                        <Text>{reviewTask.personalityName}</Text>
                    </Col>
                    <Col
                        span={24}
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        {isImage ? (
                            <PhotoOutlinedIcon color="primary" />
                        ) : (
                            <ArticleOutlinedIcon color="primary" />
                        )}
                        <Avatar.Group>
                            {reviewTask.usersName &&
                                reviewTask.usersName.map((user, index) => {
                                    return <UserTag user={user} key={index} />;
                                })}
                        </Avatar.Group>
                    </Col>
                </Row>
            </CardBase>
        </a>
    );
};

export default KanbanCard;
