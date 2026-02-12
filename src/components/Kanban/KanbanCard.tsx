import React from "react";
import CardBase from "../CardBase";
import UserTag from "./UserTag";
import claimApi from "../../api/claim";
import personalityApy from "../../api/personality";
import { useTranslation } from "next-i18next";
import actions from "../../store/actions";
import { useDispatch } from "react-redux";
import { ContentModelEnum } from "../../types/enums";
import { PhotoOutlined, ArticleOutlined } from "@mui/icons-material";
import { AvatarGroup, Grid, Typography, Chip } from "@mui/material";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import SourceApi from "../../api/sourceApi";
import { ReviewTaskTypeEnum } from "../../machines/reviewTask/enums";
import verificationRequestApi from "../../api/verificationRequestApi";
import colors from "../../styles/colors";
import reviewColors from "../../constants/reviewColors";

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
                    boxShadow: `0px 1px 1px ${colors.shadow}`,
                }}
            >
                <Grid container style={{ width: "100%", padding: "10px" }}>
                    <Grid
                        item
                        xs={12}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 10,
                        }}
                    >
                        <Typography
                            variant="body1"
                            style={{
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 2,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                fontSize: 14,
                                fontWeight: "bold",
                                color: colors.blackTertiary,
                            }}
                        >
                            {title || reviewTask.content.href}
                        </Typography>
                        <Typography
                            style={{
                                color: colors.blackTertiary,
                                fontSize: 14,
                            }}
                        >
                            {reviewTask.personalityName}
                        </Typography>
                        {reviewTask.value === "published" && (
                            <Grid
                                item
                                style={{
                                    display: "flex",
                                    padding: "4px 4px",
                                    gap: 3,
                                    marginBottom: 8,
                                    backgroundColor: colors.logo,
                                    borderRadius: 20,
                                    width: "fit-content",
                                    alignItems: "center",
                                }}
                            >
                                
                                <Chip
                                    label={t(
                                        `claimReviewForm:${reviewTask.content.props.classification}`
                                    ).toUpperCase()}
                                    size="small"
                                    style={{
                                        fontSize: 10,
                                        color: colors.white,
                                        fontWeight: 700,
                                        padding: "4px 13px",
                                        backgroundColor:reviewColors[reviewTask.content.props.classification],
                                    }}
                                />
                            </Grid>
                        )}
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        {isImage ? (
                            <PhotoOutlined color="primary" />
                        ) : (
                            <ArticleOutlined color="primary" />
                        )}
                        <AvatarGroup>
                            {reviewTask.usersName &&
                                reviewTask.usersName.map((user, index) => {
                                    return <UserTag user={user} key={index} />;
                                })}
                        </AvatarGroup>
                    </Grid>
                </Grid>
            </CardBase>
        </a>
    );
};

export default KanbanCard;
