import React, { useState } from "react";
import CommentCardContent from "./CommentCardContent";
import CommentCardStyle from "./CommentCard.style";
import { useCommands } from "@remirror/react";
import { useAppSelector } from "../../../store/store";

const CommentCard = ({
    user,
    comment = {},
    isEditing = false,
    setIsCommentVisible = null,
}: {
    user: any;
    comment?: any;
    isEditing?: boolean;
    setIsCommentVisible?: any;
}) => {
    const enableEditorAnnotations = useAppSelector(
        (state) => state?.enableEditorAnnotations
    );
    const { selectText } = useCommands();
    const [isResolved, setIsResolved] = useState(comment?.resolved);
    const [isSelected, setIsSelected] = useState(false);

    const handleClickCard = () => {
        const isCrossCheckingComment = comment.type === "cross-checking";
        if (enableEditorAnnotations && comment?.from && comment?.to) {
            selectText({ from: comment.from, to: comment.to });
        }
        setIsSelected(isCrossCheckingComment);
    };

    return !isResolved ? (
        <CommentCardStyle
            onClick={handleClickCard}
            isselected={isSelected.toString()}
        >
            <CommentCardContent
                key={`${comment.id}_content`}
                content={comment}
                user={user}
                isSelected={isSelected}
                setIsSelected={setIsSelected}
                setIsResolved={setIsResolved}
                isEditing={isEditing}
                setIsCommentVisible={setIsCommentVisible}
            />
        </CommentCardStyle>
    ) : (
        <></>
    );
};

export default CommentCard;
