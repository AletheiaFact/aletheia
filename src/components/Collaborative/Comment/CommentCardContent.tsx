import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useCurrentSelection, useHelpers } from "@remirror/react";
import CommentCardForm from "./CommentCardForm";
import CommentCardHeader from "./CommentCardHeader";
import CommentReplyList from "./CommentReplyList";
import { Typography } from "@mui/material";
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

const emptyBooleanSetter: Dispatch<SetStateAction<boolean>> = () => { };

const CommentCardContent = ({
    user,
    content,
    isEditing = false,
    isSelected = false,
    setIsSelected = emptyBooleanSetter,
    setIsResolved = emptyBooleanSetter,
    setIsCommentVisible = emptyBooleanSetter,
    showForm = false,
    setShowForm = emptyBooleanSetter,
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

            {isRootComment && !enableEditorAnnotations &&
                content.type === CommentEnum.review && (
                    <p
                        style={{
                            padding: "0px 10px",
                            width: "fit-content",
                            borderLeft: "2px solid black",
                            fontStyle: "italic",
                            margin: 0,
                        }}
                    >
                        {content?.text}
                    </p>
                )}

            {isRootComment && content.type === CommentEnum.crossChecking && (
                <p
                    style={{
                        padding: "0 4px",
                        color: reviewColors[content.text],
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        margin: 0,
                    }}
                >
                    {t(`claimReviewForm:${content?.text}`)}
                </p>
            )}

            <Typography
                variant="body2"
                style={{ margin: 0, whiteSpace: "pre-wrap" }}
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
                <div onClick={(e) => e.stopPropagation()}>
                    <CommentCardForm
                        user={user}
                        content={content}
                        isEditing={isEditing}
                        setIsCommentVisible={setIsCommentVisible}
                        setShowForm={setShowForm}
                    />
                </div>
            )}
        </>
    );
};

export default CommentCardContent;
