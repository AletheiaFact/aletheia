import React, { useCallback, useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import { useCommands, useCurrentSelection, useHelpers } from "@remirror/react";
import CommentCardStyle from "./CommentCard.style";
import CommentCardForm from "./CommentCardForm";
import CommentCardActions from "./CommentCardActions";

const CommentCard = ({
    user,
    content = {},
    isEditing = false,
    setIsCommentVisible = null,
}: {
    user: any;
    content?: any;
    isEditing?: boolean;
    setIsCommentVisible?: any;
}) => {
    const { from } = useCurrentSelection();
    const { selectText } = useCommands();
    const { selectionHasAnnotation, getAnnotationsAt } = useHelpers();
    const [isSelected, setIsSelected] = useState(false);
    const [isResolved, setIsResolved] = useState(content?.resolved);
    const selectionHasComment = selectionHasAnnotation();
    const name = content.user?.name || user?.name;

    useEffect(() => {
        const annotations = getAnnotationsAt(from);
        const hasMatchingId = annotations.some(
            (annotation) => annotation?.id === content?._id
        );
        setIsSelected(hasMatchingId);
    }, [content?._id, from, getAnnotationsAt, selectionHasComment]);

    const getCommentTime = useCallback(() => {
        const date = new Date(content?.createdAt);
        const currentDate = new Date();
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");

        if (isSameDay(date, currentDate)) {
            return `${hours}:${minutes} hoje`;
        }

        currentDate.setDate(currentDate.getDate() - 1);

        if (isSameDay(date, currentDate)) {
            return `${hours}:${minutes} ontem`;
        }

        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");

        return `${hours}:${minutes} - ${day}/${month}`;

        function isSameDay(date1, date2) {
            return (
                date1.getDate() === date2.getDate() &&
                date1.getMonth() === date2.getMonth() &&
                date1.getFullYear() === date2.getFullYear()
            );
        }
    }, [content?.createdAt]);

    const handleClickCard = () => {
        if (content?.from && content?.to) {
            selectText({ from: content.from, to: content.to });
        }
    };

    if (!isResolved) {
        return (
            <CommentCardStyle
                onClick={handleClickCard}
                isselected={isSelected.toString()}
            >
                <div className="comment-card-header">
                    <div className="comment-card-header-info">
                        <Avatar className="comment-card-header-info-avatar">
                            {name.slice(0, 1)}
                        </Avatar>
                        <div>
                            <p style={{ margin: 0, paddingTop: 4 }}>{name}</p>
                            {!isEditing && (
                                <p style={{ margin: 0, fontSize: 12 }}>
                                    {getCommentTime()}
                                </p>
                            )}
                        </div>
                    </div>
                    {!isEditing && (
                        <CommentCardActions
                            content={content}
                            setIsResolved={setIsResolved}
                        />
                    )}
                </div>
                <p style={{ margin: 0, fontSize: 14 }}>{content?.comment}</p>
                {(isEditing || isSelected) && (
                    <CommentCardForm
                        user={user}
                        setIsCommentVisible={setIsCommentVisible}
                        isEditing={isEditing}
                        isSelected={isSelected}
                    />
                )}
            </CommentCardStyle>
        );
    } else {
        return <></>;
    }
};

export default CommentCard;
