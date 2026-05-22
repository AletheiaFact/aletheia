import React, { Dispatch, SetStateAction } from "react";
import { Avatar, Box, Typography } from "@mui/material";
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
        <Box className="comment-card-header">
            <Box className="comment-card-header-info">
                <Avatar className="comment-card-header-info-avatar">
                    {name.slice(0, 1)}
                </Avatar>
                <Box>
                    <Typography variant="body1" sx={{ pt: 0.5 }}>
                        {name}
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            display: "block",
                            textTransform: "capitalize",
                        }}
                    >
                        {content.type}
                    </Typography>
                    {!isEditing && (
                        <Typography variant="caption" sx={{ display: "block" }}>
                            {formatCommentTime(content?.createdAt)}
                        </Typography>
                    )}
                </Box>
            </Box>
            {!isEditing && (
                <CommentCardActions
                    content={content}
                    setIsResolved={setIsResolved}
                />
            )}
        </Box>
    );
};

export default CommentCardHeader;
