import React from "react";
import CommentCard from "./CommentCard";
import { Comment } from "../../../types/Comment";
import { User } from "../../../types/User";

interface CommentsListProps {
    comments: Comment[] | null;
    user: User | null;
}

const CommentsList = ({ comments, user }: CommentsListProps) => {
    return (
        <>
            {comments?.map((comment) => (
                <CommentCard
                    key={comment._id ?? comment.id}
                    comment={comment}
                    user={user}
                />
            ))}
        </>
    );
};

export default CommentsList;