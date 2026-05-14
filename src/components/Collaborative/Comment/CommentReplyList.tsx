import React, { Dispatch, SetStateAction } from "react";
import { Divider } from "@mui/material";
import CommentCardContent from "./CommentCardContent";
import { Comment } from "../../../types/Comment";
import { User } from "../../../types/User";

interface CommentReplyListProps {
    replies: Comment[];
    user: User | null;
    isSelected: boolean;
    setIsSelected: Dispatch<SetStateAction<boolean>>;
    setIsResolved: Dispatch<SetStateAction<boolean>>;
}

const CommentReplyList = ({
    replies,
    user,
    isSelected,
    setIsSelected,
    setIsResolved,
}: CommentReplyListProps) => {
    if (!replies?.length) return null;

    return (
        <>
            {replies.map((reply) => (
                <React.Fragment key={reply._id ?? reply.id}>
                    <Divider />
                    <CommentCardContent
                        user={user}
                        content={reply}
                        isSelected={isSelected}
                        setIsSelected={setIsSelected}
                        setIsResolved={setIsResolved}
                        isReplyCard
                    />
                </React.Fragment>
            ))}
        </>
    );
};

export default CommentReplyList;