import React from "react";
// import { useCurrentSelection, useHelpers } from "@remirror/react";
import CommentCardForm from "./CommentCardForm";
import CommentCardHeader from "./CommentCardHeader";
import { Divider } from "@mui/material";

const CommentCardContent = ({
    user,
    content = {},
    isEditing = false,
    setIsCommentVisible = null,
    isSelected = false,
    setIsSelected = () => {},
    setIsResolved = () => {},
}: {
    user: any;
    content?: any;
    isEditing?: boolean;
    setIsCommentVisible?: any;
    isSelected?: boolean;
    setIsSelected?: any;
    setIsResolved?: any;
}) => {
    // const { from } = useCurrentSelection();
    // const { getAnnotationsAt } = useHelpers();

    // useEffect(() => {
    //     const annotations = getAnnotationsAt(from);
    //     const hasMatchingId = annotations.some(
    //         (annotation) => annotation?.id === content?._id
    //     );
    //     setIsSelected(hasMatchingId);
    // }, [content?._id, from, getAnnotationsAt, setIsSelected]);

    return (
        <>
            <CommentCardHeader
                content={content}
                name={content.user?.name || user?.name}
                isEditing={isEditing}
                setIsResolved={setIsResolved}
            />
            {!content.isReply && (
                <p
                    style={{
                        padding: "0px 10px",
                        width: "fit-content",
                        borderLeft: "2px solid black",
                        fontStyle: "italic",
                        margin: 0,
                    }}
                >
                    {content?.text}
                </p>
            )}
            <p style={{ margin: 0, fontSize: 14 }}>{content?.comment}</p>
            {!content.isReply && (
                <>
                    {content.replies?.map((replyComment) => (
                        <>
                            <Divider />
                            <CommentCardContent
                                key={replyComment.id}
                                user={user}
                                content={replyComment}
                                isSelected={isSelected}
                                setIsSelected={setIsSelected}
                                setIsResolved={setIsResolved}
                            />
                        </>
                    ))}
                    {(isEditing || isSelected) && (
                        <CommentCardForm
                            user={user}
                            setIsCommentVisible={setIsCommentVisible}
                            isEditing={isEditing}
                            content={content}
                        />
                    )}
                </>
            )}
        </>
    );
};

export default CommentCardContent;