import React, { useCallback, useContext, useState } from "react";
import Button, { ButtonType } from "../../Button";
import AletheiaInput from "../../AletheiaInput";
import ClaimReviewTaskApi from "../../../api/ClaimReviewTaskApi";
import { useCommands, useCurrentSelection } from "@remirror/react";
import { CollaborativeEditorContext } from "../CollaborativeEditorProvider";

const CommentCardForm = ({ user, setIsCommentVisible }) => {
    const { from, to, $to } = useCurrentSelection();
    const { addAnnotation } = useCommands();
    const { data_hash, setComments } = useContext(CollaborativeEditorContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [commentValue, setCommentValue] = useState("");

    const handleOnSubmit = useCallback(async () => {
        setIsLoading(true);
        const text = $to.doc.textBetween(from, to);
        try {
            const newComment = {
                from,
                to,
                text,
                comment: commentValue,
                user: user?._id,
            };
            const { comment: createdComment } =
                await ClaimReviewTaskApi.addComment(data_hash, newComment);
            if (addAnnotation.enabled({ id: createdComment?._id })) {
                addAnnotation({ id: createdComment?._id });
                setComments((comments) => {
                    if (comments) {
                        return [...comments, createdComment];
                    }
                    return [createdComment];
                });
            }
        } catch (e) {
            console.log(e);
        } finally {
            setCommentValue("");
            setIsCommentVisible(false);
            setIsLoading(false);
        }
    }, [
        $to.doc,
        addAnnotation,
        commentValue,
        data_hash,
        from,
        setComments,
        setIsCommentVisible,
        to,
        user?._id,
    ]);

    const handleCancel = () => {
        setIsCommentVisible(false);
        setCommentValue("");
    };

    return (
        <div className="comment-card-form">
            <AletheiaInput
                value={commentValue}
                onChange={({ target }) => setCommentValue(target.value)}
            />

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
        </div>
    );
};

export default CommentCardForm;
