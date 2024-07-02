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
import SourceApi from "../../api/sourceApi";
import { ReviewTaskTypeEnum } from "../../machines/reviewTask/enums";
import verificationRequestApi from "../../api/verificationRequestApi";

const { Text, Paragraph } = Typography;

const KanbanCard = ({ reviewTask, reviewTaskType }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [nameSpace] = useAtom(currentNameSpace);
    const apiCallFunctions = {
        [ReviewTaskTypeEnum.Claim]: claimApi.getById,
        [ReviewTaskTypeEnum.Source]: SourceApi.getById,
        [ReviewTaskTypeEnum.VerificationRequest]:
            verificationRequestApi.getById,
    };

    const goToClaimReview = () => {
        dispatch(actions.setSelectTarget(null));
        dispatch(actions.setSelectPersonality(null));
        dispatch(actions.setSelectContent(null));
        Promise.all([
            apiCallFunctions[reviewTaskType](reviewTask.targetId, t, {
                nameSpace,
            }),
            personalityApy.getPersonality(reviewTask.personalityId, {}, t),
        ]).then(([target, personality]) => {
            dispatch(actions.setSelectTarget(target));
            dispatch(actions.setSelectPersonality(personality));
            dispatch(
                actions.setSelectContent({
                    ...reviewTask?.content,
                    reviewTaskType,
                })
            );
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
                            {title || reviewTask.content.href}
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
