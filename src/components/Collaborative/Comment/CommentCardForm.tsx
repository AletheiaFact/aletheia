import React, {
    Dispatch,
    KeyboardEvent,
    SetStateAction,
    useCallback,
    useContext,
    useState,
} from "react";
import Button, { ButtonType } from "../../Button";
import AletheiaTextArea from "../../AletheiaTextArea";
import ReviewTaskApi from "../../../api/reviewTaskApi";
import { useCommands, useCurrentSelection } from "@remirror/react";
import { VisualEditorContext } from "../VisualEditorProvider";
import CommentApi from "../../../api/comment";
import { useTranslation } from "next-i18next";
import colors from "../../../styles/colors";
import { useAppSelector } from "../../../store/store";
import { Comment, NewCommentPayload } from "../../../types/Comment";
import { User } from "../../../types/User";

interface CommentCardFormProps {
    user: User | null;
    content: Comment;
    isEditing: boolean;
    setIsCommentVisible?: Dispatch<SetStateAction<boolean>>;
    setShowForm?: Dispatch<SetStateAction<boolean>>;
}

const noop = () => { };

const CommentCardForm = ({
    user,
    content,
    isEditing,
    setIsCommentVisible = noop,
    setShowForm = noop,
}: CommentCardFormProps) => {
    const enableEditorAnnotations = useAppSelector(
        (state) => state?.enableEditorAnnotations
    );
    const { t } = useTranslation();
    const { from, to, $to } = useCurrentSelection();
    const { addAnnotation } = useCommands();
    const { data_hash, setComments } = useContext(VisualEditorContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [commentValue, setCommentValue] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const isReplying = !!content._id;

    const handleOnSubmit = useCallback(async () => {
        if (!commentValue) {
            setError(t("common:requiredFieldError"));
            return;
        }

        try {
            setError(null);
            setIsLoading(true);
            const selectedText = $to.doc.textBetween(from, to);
            const newComment: NewCommentPayload = {
                from,
                to,
                text: isReplying ? content.text : selectedText,
                comment: commentValue,
                user: user?._id ?? "",
            };

            if (isReplying) {
                const replyComment = await CommentApi.createReplyComment(
                    content._id,
                    newComment
                );
                setComments?.((comments: Comment[]) =>
                    comments.map((comment) =>
                        comment._id === content._id
                            ? {
                                ...comment,
                                replies: [...comment.replies, replyComment],
                            }
                            : comment
                    )
                );
                setShowForm(false);
            } else {
                const { comment: createdComment } =
                    await ReviewTaskApi.addComment(data_hash, newComment);

                if (
                    enableEditorAnnotations &&
                    addAnnotation.enabled({ id: createdComment?._id })
                ) {
                    addAnnotation({ id: createdComment?._id });
                }
                setComments?.((comments: Comment[] | null) =>
                    comments
                        ? [...comments, createdComment]
                        : [createdComment]
                );
                setIsCommentVisible(false);
            }
        } catch (submitError) {
            console.error(
                "Error while handling comment submission:",
                submitError
            );
        } finally {
            setCommentValue("");
            setIsLoading(false);
        }
    }, [
        $to.doc,
        addAnnotation,
        content.text,
        content._id,
        commentValue,
        data_hash,
        enableEditorAnnotations,
        from,
        isReplying,
        setComments,
        setIsCommentVisible,
        setShowForm,
        t,
        to,
        user?._id,
    ]);

    const handleKeyDown = (element: KeyboardEvent<HTMLTextAreaElement>) => {
        if (element.key === "Enter" && (element.ctrlKey || element.metaKey)) {
            handleOnSubmit();
        }

        if (element.key === "Escape" && isEditing) {
            setIsCommentVisible(false);
        }
    };

    const handleCancel = () => {
        if (isEditing) {
            setIsCommentVisible(false);
        }
        setShowForm(false);
        setError(null);
        setCommentValue("");
    };

    return (
        <div className="comment-card-form">
            <AletheiaTextArea
                multiline
                minRows={3}
                value={commentValue}
                onChange={({ target }) => setCommentValue(target.value)}
                onKeyDown={handleKeyDown}
            />
            {error && (
                <span style={{ fontSize: 14, color: colors.error }}>
                    {error}
                </span>
            )}

            <div className="comment-card-form-actions">
                <Button onClick={handleOnSubmit} loading={isLoading}>
                    {t("common:submit")}
                </Button>
                <Button
                    type={ButtonType.whiteBlack}
                    onClick={handleCancel}
                    loading={isLoading}
                >
                    {t("common:cancel")}
                </Button>
            </div>
        </div>
    );
};

export default CommentCardForm;
