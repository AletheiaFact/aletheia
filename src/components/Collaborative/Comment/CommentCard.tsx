import React, { Dispatch, SetStateAction, useState } from "react";
import CommentCardContent from "./CommentCardContent";
import CommentCardStyle from "./CommentCard.style";
import { useCommands } from "@remirror/react";
import { useAppSelector } from "../../../store/store";
import { Comment } from "../../../types/Comment";
import { CommentEnum } from "../../../types/enums";
import { User } from "../../../types/User";

interface CommentCardProps {
    user: User | null;
    comment: Comment;
    isEditing?: boolean;
    setIsCommentVisible?: Dispatch<SetStateAction<boolean>>;
}

const CommentCard = ({
    user,
    comment,
    isEditing = false,
    setIsCommentVisible,
}: CommentCardProps) => {
    const enableEditorAnnotations = useAppSelector(
        (state) => state?.enableEditorAnnotations
    );
    const { selectText } = useCommands();
    const [isResolved, setIsResolved] = useState<boolean>(!!comment?.resolved);
    const [isSelected, setIsSelected] = useState<boolean>(false);
    const [showForm, setShowForm] = useState<boolean>(false);

    const handleClickCard = () => {
        const isCrossCheckingComment =
            comment.type === CommentEnum.crossChecking;
        if (enableEditorAnnotations && comment?.from && comment?.to) {
            selectText({ from: comment.from, to: comment.to });
        }
        setIsSelected(isCrossCheckingComment);
        setShowForm((prev) => !prev);
    };

    if (isResolved) return null;

    return (
        <CommentCardStyle
            onClick={handleClickCard}
            isselected={isSelected.toString()}
        >
            <CommentCardContent
                content={comment}
                user={user}
                isSelected={isSelected}
                setIsSelected={setIsSelected}
                setIsResolved={setIsResolved}
                isEditing={isEditing}
                setIsCommentVisible={setIsCommentVisible}
                showForm={showForm}
                setShowForm={setShowForm}
            />
        </CommentCardStyle>
    );
};

export default CommentCard;