import React, { useEffect } from "react";
import { useCurrentSelection, useHelpers } from "@remirror/react";
import CommentCardForm from "./CommentCardForm";
import CommentCardHeader from "./CommentCardHeader";
import { Divider } from "@mui/material";

const CommentCard = ({
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
    const { from } = useCurrentSelection();
    const { getAnnotationsAt } = useHelpers();

    useEffect(() => {
        const annotations = getAnnotationsAt(from);
        const hasMatchingId = annotations.some(
            (annotation) => annotation?.id === content?._id
        );
        setIsSelected(hasMatchingId);
    }, [content?._id, from, getAnnotationsAt, setIsSelected]);

    return (
        <>
            <CommentCardHeader
                content={content}
                name={content.user?.name || user?.name}
                isEditing={isEditing}
                setIsResolved={setIsResolved}
            />
            <p style={{ margin: 0, fontSize: 14 }}>{content?.comment}</p>
            {!content.isReply && (
                <>
                    {content.replies &&
                        content.replies.map((replyComment) => (
                            <>
                                <Divider />
                                <CommentCard
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

export default CommentCard;
