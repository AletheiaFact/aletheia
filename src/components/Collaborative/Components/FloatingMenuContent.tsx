import React from "react";
import CommentContainer from "../Comment/CommentContainer";
import FloatingLinkToolbar from "./LinkToolBar/FloatingLinkToolbar";

const FloatingMenuContent = ({
    state,
    isCommentVisible,
    setIsCommentVisible,
    isEditing,
    onRemoveLink,
    submitHref,
    href,
    setHref,
    cancelHref,
    error,
    isLoading,
}) => {
    return (
        <>
            <CommentContainer
                state={state}
                isCommentVisible={isCommentVisible}
                setIsCommentVisible={setIsCommentVisible}
            />
            <FloatingLinkToolbar
                isEditing={isEditing}
                onRemoveLink={onRemoveLink}
                submitHref={submitHref}
                href={href}
                setHref={setHref}
                cancelHref={cancelHref}
                error={error}
                isLoading={isLoading}
            />
        </>
    );
};

export default FloatingMenuContent;
