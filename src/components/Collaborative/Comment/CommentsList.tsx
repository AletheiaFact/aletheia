import React from "react";
import CommentCard from "./CommentCard";

const CommentsList = ({ comments, user }) => {
    return (
        <>
            {comments &&
                comments.map((comment) => {
                    return (
                        <CommentCard
                            key={comment.id}
                            content={comment}
                            user={user}
                        />
                    );
                })}
        </>
    );
};

export default CommentsList;
