import React, { useEffect } from "react";
import { useCurrentSelection, useHelpers } from "@remirror/react";
import CommentCardForm from "./CommentCardForm";
import CommentCardHeader from "./CommentCardHeader";
import { Divider } from "@mui/material";
import reviewColors from "../../../constants/reviewColors";
import { useTranslation } from "next-i18next";
import { CommentEnum } from "../../../types/enums";
import { useAppSelector } from "../../../store/store";

const CommentCardContent = ({
    user,
    content = {},
    isEditing = false,
    setIsCommentVisible = null,
    isSelected = false,
    setIsSelected = () => {},
    setIsResolved = () => {},
}: {
    user: any;
    content?: any;
    isEditing?: boolean;
    setIsCommentVisible?: any;
    isSelected?: boolean;
    setIsSelected?: any;
    setIsResolved?: any;
}) => {
    const enableEditorAnnotations = useAppSelector(
        (state) => state?.enableEditorAnnotations
    );
    const { t } = useTranslation();
    const { from } = useCurrentSelection();
    const { getAnnotationsAt } = useHelpers();

    useEffect(() => {
        if (enableEditorAnnotations) {
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
    ]);

    return (
        <>
            <CommentCardHeader
                content={content}
                name={content.user?.name || user?.name}
                isEditing={isEditing}
                setIsResolved={setIsResolved}
            />
            {!content.isReply && (
                <>
                    {!enableEditorAnnotations &&
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
                    {content.type === CommentEnum.crossChecking && (
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
                </>
            )}
            <p style={{ margin: 0, fontSize: 14 }}>{content?.comment}</p>
            {!content.isReply && (
                <>
                    {content.replies?.map((replyComment) => (
                        <>
                            <Divider />
                            <CommentCardContent
                                key={replyComment.id}
                                user={user}
                                content={replyComment}
                                isSelected={isSelected}
                                setIsSelected={setIsSelected}
                                setIsResolved={setIsResolved}
                            />
                        </>
                    ))}
                    {(isEditing || isSelected) && (
                        <CommentCardForm
                            user={user}
                            setIsCommentVisible={setIsCommentVisible}
                            isEditing={isEditing}
                            content={content}
                        />
                    )}
                </>
            )}
        </>
    );
};

export default CommentCardContent;
