import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import CardBase from "../../CardBase";
import colors from "../../../styles/colors";
import { useCurrentSelection, useHelpers } from "@remirror/react";

const CommentCard = ({ content, user }) => {
    const { from } = useCurrentSelection();
    const { selectionHasAnnotation, getAnnotationsAt } = useHelpers();
    const [isSelected, setIsSelected] = useState(false);
    const selectionHasComment = selectionHasAnnotation();
    const name = content?.user?.name || user?.name;

    useEffect(() => {
        const annotations = getAnnotationsAt(from);
        const hasMatchingId = annotations.some(
            (annotation) => annotation?.id === content._id
        );
        setIsSelected(hasMatchingId);
    }, [content._id, from, getAnnotationsAt, selectionHasComment]);

    return (
        <CardBase
            style={{
                padding: "16px",
                height: "auto",
                width: "100%",
                maxHeight: 150,
                gap: 16,
                transition: "transform 0.3s",
                transform: isSelected ? "translateX(-15px)" : "translateX(0)",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    width: "100%",
                }}
            >
                <Avatar
                    style={{
                        margin: 0,
                        background: colors.blueQuartiary,
                        width: "32px",
                        height: "32px",
                        fontSize: "16px",
                        paddingTop: 4,
                    }}
                >
                    {name.slice(0, 1)}
                </Avatar>
                <p style={{ margin: 0, paddingTop: 4 }}>{name}</p>
            </div>
            <p style={{ margin: 0, fontSize: 14 }}>{content.comment}</p>
        </CardBase>
    );
};

export default CommentCard;
