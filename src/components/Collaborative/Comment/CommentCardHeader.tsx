import React from "react";
import { Avatar } from "@mui/material";
import CommentCardActions from "./CommentCardActions";

const CommentCardHeader = ({ content, name, isEditing, setIsResolved }) => {
    const getCommentTime = (createdAt) => {
        if (!createdAt) return "";

        const date = new Date(createdAt);
        const currentDate = new Date();

        const options = {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
        } as Intl.DateTimeFormatOptions;

        if (isSameDay(date, currentDate)) {
            return new Intl.DateTimeFormat("pt-BR", options).format(date);
        }

        currentDate.setDate(currentDate.getDate() - 1);

        if (isSameDay(date, currentDate)) {
            return new Intl.DateTimeFormat("pt-BR", options).format(date);
        }

        return new Intl.DateTimeFormat("pt-BR", options).format(date);

        function isSameDay(date1, date2) {
            return (
                date1.getDate() === date2.getDate() &&
                date1.getMonth() === date2.getMonth() &&
                date1.getFullYear() === date2.getFullYear()
            );
        }
    };

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
                            {getCommentTime(content?.createdAt)}
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
