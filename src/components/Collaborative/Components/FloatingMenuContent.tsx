import React from "react";
import CommentContainer from "../Comment/CommentContainer";
import FloatingLinkToolbar from "./LinkToolBar/FloatingLinkToolbar";
import { ReviewTaskTypeEnum } from "../../../machines/reviewTask/enums";

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
    reviewTaskType,
}) => {
    return (
        <>
            <CommentContainer
                state={state}
                isCommentVisible={isCommentVisible}
                setIsCommentVisible={setIsCommentVisible}
            />

            {reviewTaskType === ReviewTaskTypeEnum.Claim && (
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
            )}
        </>
    );
};

export default FloatingMenuContent;
