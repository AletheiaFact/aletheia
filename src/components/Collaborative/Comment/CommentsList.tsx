import React from "react";
import CommentCard from "./CommentCard";

const CommentsList = ({ comments, user }) => {
    return (
        <>
            {comments?.map((comment) => (
                <CommentCard key={comment.id} comment={comment} user={user} />
            ))}
        </>
    );
};

export default CommentsList;
