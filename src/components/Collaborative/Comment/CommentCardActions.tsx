import React, {
    Dispatch,
    MouseEvent,
    SetStateAction,
    useContext,
} from "react";
import CheckIcon from "@mui/icons-material/Check";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Tooltip from "@mui/material/Tooltip";
import Button, { ButtonType } from "../../Button";
import CommentApi from "../../../api/comment";
import { VisualEditorContext } from "../VisualEditorProvider";
import { useCommands } from "@remirror/react";
import { useAppSelector } from "../../../store/store";
import { useReviewTaskPermissions } from "../../../machines/reviewTask/usePermissions";
import { useTranslation } from "next-i18next";
import { Comment } from "../../../types/Comment";

interface CommentCardActionsProps {
    content: Comment;
    setIsResolved: Dispatch<SetStateAction<boolean>>;
}

const stopPropagation = (event: MouseEvent) => event.stopPropagation();

const CommentCardActions = ({
    content,
    setIsResolved,
}: CommentCardActionsProps) => {
    const { t } = useTranslation();
    const enableEditorAnnotations = useAppSelector(
        (state) => state?.enableEditorAnnotations
    );
    const { setComments } = useContext(VisualEditorContext);
    const { removeAnnotations } = useCommands();
    const permissions = useReviewTaskPermissions();

    const canActOnComment =
        permissions.isAdmin ||
        permissions.isReviewer ||
        permissions.isCrossChecker ||
        permissions.isAssignee;

    const handleResolveThread = async (event: MouseEvent) => {
        event.stopPropagation();
        try {
            await CommentApi.updateComment(content._id, { resolved: true });
            setIsResolved(true);
            if (enableEditorAnnotations) {
                removeAnnotations([content._id]);
            }
            setComments?.((prev: Comment[]) =>
                (prev ?? []).filter((c) => c._id !== content._id)
            );
        } catch (error) {
            console.error("Error resolving comment thread:", error);
        }
    };

    const handleDeleteReply = async (event: MouseEvent) => {
        event.stopPropagation();
        try {
            await CommentApi.deleteReplyComment(content.targetId, content._id);
            setComments?.((comments: Comment[]) =>
                (comments ?? []).map((comment) =>
                    comment._id === content.targetId
                        ? {
                              ...comment,
                              replies: comment.replies.filter(
                                  (reply) => reply._id !== content._id
                              ),
                          }
                        : comment
                )
            );
        } catch (error) {
            console.error("Error deleting reply:", error);
        }
    };

    if (!canActOnComment) return null;

    return (
        <div className="comment-card-actions" onClick={stopPropagation}>
            {content.isReply ? (
                <Tooltip title={t("common:delete") || "Delete"}>
                    <span>
                        <Button
                            type={ButtonType.white}
                            onClick={handleDeleteReply}
                        >
                            <DeleteOutlineIcon style={{ fontSize: "16px" }} />
                        </Button>
                    </span>
                </Tooltip>
            ) : (
                <div className="comment-card-actions-resolve-button">
                    <Tooltip title={t("common:resolve") || "Resolve"}>
                        <span>
                            <Button
                                type={ButtonType.white}
                                onClick={handleResolveThread}
                            >
                                <CheckIcon style={{ fontSize: "16px" }} />
                            </Button>
                        </span>
                    </Tooltip>
                </div>
            )}
        </div>
    );
};

export default CommentCardActions;