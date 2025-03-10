import React, { useCallback, useContext, useState } from "react";
import Button, { ButtonType } from "../../Button";
import AletheiaInput from "../../AletheiaInput";
import ReviewTaskApi from "../../../api/reviewTaskApi";
import { useCommands, useCurrentSelection } from "@remirror/react";
import { VisualEditorContext } from "../VisualEditorProvider";
import CommentApi from "../../../api/comment";
import { useTranslation } from "next-i18next";
import colors from "../../../styles/colors";
import { useAppSelector } from "../../../store/store";

const CommentCardForm = ({ user, setIsCommentVisible, isEditing, content }) => {
    const enableEditorAnnotations = useAppSelector(
        (state) => state?.enableEditorAnnotations
    );
    const { t } = useTranslation();
    const { from, to, $to } = useCurrentSelection();
    const { addAnnotation } = useCommands();
    const { data_hash, setComments } = useContext(VisualEditorContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showButtons, setShowButtons] = useState<boolean>(false);
    const [commentValue, setCommentValue] = useState("");
    const [error, setError] = useState<boolean>(null);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            handleOnSubmit();
        }

        if (e.key === "Escape" && isEditing) {
            setIsCommentVisible(false);
        }
    };

    const handleOnSubmit = useCallback(async () => {
        if (!commentValue) {
            setError(t("common:requiredFieldError"));
            return;
        }

        try {
            setError(null);
            setIsLoading(true);
            const text = $to.doc.textBetween(from, to);
            const createdAt = Date.now();
            const newComment = {
                from,
                to,
                text,
                comment: commentValue,
                user: user?._id,
                isReply: !!content._id,
                createdAt,
            };
            if (content._id) {
                newComment.text = content.text;
                const replyComment = await CommentApi.createReplyComment(
                    content._id,
                    newComment
                );
                setComments((comments) =>
                    comments.map((comment) =>
                        comment._id === content._id
                            ? {
                                  ...comment,
                                  replies: [...comment.replies, replyComment],
                              }
                            : comment
                    )
                );
            } else {
                const { comment: createdComment } =
                    await ReviewTaskApi.addComment(data_hash, newComment);

                if (
                    enableEditorAnnotations &&
                    addAnnotation.enabled({ id: createdComment?._id })
                ) {
                    addAnnotation({ id: createdComment?._id });
                }
                setComments((comments) =>
                    comments ? [...comments, createdComment] : [createdComment]
                );
                setIsCommentVisible(false);
            }
        } catch (error) {
            console.error("Error while handling comment submission:", error);
        } finally {
            setCommentValue("");
            setIsLoading(false);
        }
    }, [
        $to.doc,
        addAnnotation,
        content.text,
        commentValue,
        content._id,
        data_hash,
        from,
        setComments,
        setIsCommentVisible,
        t,
        to,
        user?._id,
        enableEditorAnnotations,
    ]);

    const handleCancel = () => {
        if (isEditing) {
            setIsCommentVisible(false);
        }
        setError(null);
        setShowButtons(false);
        setCommentValue("");
    };

    return (
        <div className="comment-card-form">
            <AletheiaInput
                value={commentValue}
                onChange={({ target }) => setCommentValue(target.value)}
                onFocus={() => setShowButtons(true)}
                onKeyDown={(e) => handleKeyDown(e)}
            />
            {error && (
                <span style={{ fontSize: 14, color: colors.error }}>
                    {error}
                </span>
            )}

            {(isEditing || showButtons) && (
                <div className="comment-card-form-actions">
                    <Button onClick={handleOnSubmit} loading={isLoading}>
                        Submit
                    </Button>
                    <Button
                        type={ButtonType.whiteBlack}
                        onClick={handleCancel}
                        loading={isLoading}
                    >
                        Cancel
                    </Button>
                </div>
            )}
        </div>
    );
};

export default CommentCardForm;
