import React, { Dispatch, SetStateAction } from "react";
import { Avatar } from "@mui/material";
import CommentCardActions from "./CommentCardActions";
import { Comment } from "../../../types/Comment";
import { formatCommentTime } from "../../../utils/date.utils";

interface CommentCardHeaderProps {
    content: Comment;
    name: string;
    isEditing: boolean;
    setIsResolved: Dispatch<SetStateAction<boolean>>;
}

const CommentCardHeader = ({
    content,
    name,
    isEditing,
    setIsResolved,
}: CommentCardHeaderProps) => {
    return (
        <div className="comment-card-header">
            <div className="comment-card-header-info">
                <Avatar className="comment-card-header-info-avatar">
                    {name.slice(0, 1)}
                </Avatar>
                <div>
                    <p style={{ margin: 0, paddingTop: 4 }}>{name}</p>
                    <p
                        style={{
                            margin: 0,
                            fontSize: 12,
                            textTransform: "capitalize",
                        }}
                    >
                        {content.type}
                    </p>
                    {!isEditing && (
                        <p style={{ margin: 0, fontSize: 12 }}>
                            {formatCommentTime(content?.createdAt)}
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
    );
};

export default CommentCardHeader;
