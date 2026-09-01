import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useCurrentSelection, useHelpers } from "@remirror/react";
import CommentCardForm from "./CommentCardForm";
import CommentCardHeader from "./CommentCardHeader";
import CommentReplyList from "./CommentReplyList";
import { Box, Typography } from "@mui/material";
import reviewColors from "../../../constants/reviewColors";
import { useTranslation } from "next-i18next";
import { CommentEnum } from "../../../types/enums";
import { useAppSelector } from "../../../store/store";
import { usePluginReady } from "../utils/usePluginReady";
import { Comment } from "../../../types/Comment";
import { User } from "../../../types/User";

interface CommentCardContentProps {
    user: User | null;
    content: Comment;
    isEditing?: boolean;
    isSelected?: boolean;
    setIsSelected?: Dispatch<SetStateAction<boolean>>;
    setIsResolved?: Dispatch<SetStateAction<boolean>>;
    setIsCommentVisible?: Dispatch<SetStateAction<boolean>>;
    showForm?: boolean;
    setShowForm?: Dispatch<SetStateAction<boolean>>;
    isReplyCard?: boolean;
}

const CommentCardContent = ({
    user,
    content,
    isEditing = false,
    isSelected = false,
    setIsSelected,
    setIsResolved,
    setIsCommentVisible,
    showForm = false,
    setShowForm,
    isReplyCard = false,
}: CommentCardContentProps) => {
    const enableEditorAnnotations = useAppSelector(
        (state) => state?.enableEditorAnnotations
    );
    const { t } = useTranslation();
    const { from } = useCurrentSelection();
    const { getAnnotationsAt } = useHelpers();

    const isPluginReady = usePluginReady("annotation", enableEditorAnnotations);
    const displayName = content.user?.name || user?.name || "";
    const isRootComment = !isReplyCard && !content.isReply;
    const shouldRenderForm = isRootComment && (isEditing || showForm);

    useEffect(() => {
        if (enableEditorAnnotations && isPluginReady) {
            const annotations = getAnnotationsAt(from);
            const hasMatchingId = annotations.some(
                (annotation) => annotation?.id === content?._id
            );
            setIsSelected(hasMatchingId);
        }
    }, [
        content?._id,
        enableEditorAnnotations,
        from,
        getAnnotationsAt,
        setIsSelected,
        isPluginReady,
    ]);

    return (
        <>
            <CommentCardHeader
                content={content}
                name={displayName}
                isEditing={isEditing}
                setIsResolved={setIsResolved}
            />

            {isRootComment &&
                !enableEditorAnnotations &&
                content.type === CommentEnum.review && (
                    <Typography
                        variant="body1"
                        className="comment-card-content-reply-text"
                    >
                        {content?.text}
                    </Typography>
                )}

            {isRootComment && content.type === CommentEnum.crossChecking && (
                <Typography
                    variant="body1"
                    className="comment-card-classification-text "
                    sx={{ color: reviewColors[content.text] }}
                >
                    {t(`claimReviewForm:${content?.text}`)}
                </Typography>
            )}

            <Typography
                variant="body2"
                sx={{ margin: 0, whiteSpace: "pre-wrap" }}
            >
                {content?.comment}
            </Typography>

            {isRootComment && (
                <CommentReplyList
                    replies={content.replies}
                    user={user}
                    isSelected={isSelected}
                    setIsSelected={setIsSelected}
                    setIsResolved={setIsResolved}
                />
            )}

            {shouldRenderForm && (
                <Box onClick={(event) => event.stopPropagation()}>
                    <CommentCardForm
                        user={user}
                        content={content}
                        isEditing={isEditing}
                        setIsCommentVisible={setIsCommentVisible}
                        setShowForm={setShowForm}
                        t={t}
                    />
                </Box>
            )}
        </>
    );
};

export default CommentCardContent;
