import React, {
    Dispatch,
    KeyboardEvent,
    SetStateAction,
    useContext,
    useState,
} from "react";
import AletheiaButton, { ButtonType } from "../../AletheiaButton";
import AletheiaTextArea from "../../AletheiaTextArea";
import ReviewTaskApi from "../../../api/reviewTaskApi";
import { useCommands, useCurrentSelection } from "@remirror/react";
import { VisualEditorContext } from "../VisualEditorProvider";
import CommentApi from "../../../api/comment";
import { useAppSelector } from "../../../store/store";
import { Comment, NewCommentPayload } from "../../../types/Comment";
import { User } from "../../../types/User";
import { Box } from "@mui/material";
import TextError from "../../TextErrorForm";
import { useTranslations } from "next-intl";

interface CommentCardFormProps {
    user: User | null;
    content: Comment;
    isEditing: boolean;
    setIsCommentVisible?: Dispatch<SetStateAction<boolean>>;
    setShowForm?: Dispatch<SetStateAction<boolean>>;
}


const CommentCardForm = ({
    user,
    content,
    isEditing,
    setIsCommentVisible,
    setShowForm,
}: CommentCardFormProps) => {
    const enableEditorAnnotations = useAppSelector(
        (state) => state?.enableEditorAnnotations
    );

    const currentSelection = useCurrentSelection();

    const [initialSelection] = useState(() => ({
        from: currentSelection.from,
        to: currentSelection.to,
        text: currentSelection.$to.doc.textBetween(
            currentSelection.from,
            currentSelection.to
        ),
    }));
    const { addAnnotation } = useCommands();
    const { data_hash, setComments } = useContext(VisualEditorContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [commentValue, setCommentValue] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const tCommon = useTranslations("common")

    const isReplying = !!content._id;

    const handleOnSubmit = async () => {
        if (!commentValue) {
            setError(tCommon("requiredFieldError"));
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const newComment: NewCommentPayload = {
                from: initialSelection.from,
                to: initialSelection.to,
                text: isReplying ? content.text : initialSelection.text,
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
    };

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
        <Box className="comment-card-form">
            <AletheiaTextArea
                multiline
                minRows={3}
                value={commentValue}
                onChange={({ target }) => setCommentValue(target.value)}
                onKeyDown={handleKeyDown}
            />
            {error && (
                <TextError
                    stateError={true}
                    data-cy="testCommentFormError"
                >
                    {error}
                </TextError>
            )}

            <Box className="comment-card-form-actions">
                <AletheiaButton
                    onClick={handleOnSubmit}
                    loading={isLoading}
                >
                    {tCommon("submit")}
                </AletheiaButton>
                <AletheiaButton
                    type={ButtonType.whiteBlack}
                    onClick={handleCancel}
                    loading={isLoading}
                >
                    {tCommon("cancel")}
                </AletheiaButton>
            </Box>
        </Box>
    );
};

export default CommentCardForm;
