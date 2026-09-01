import React, { Dispatch, MouseEvent, SetStateAction, useContext } from "react";
import CheckIcon from "@mui/icons-material/Check";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Box, Tooltip } from "@mui/material";
import { useAtom } from "jotai";
import AletheiaButton, { ButtonType } from "../../AletheiaButton";
import CommentApi from "../../../api/comment";
import { VisualEditorContext } from "../VisualEditorProvider";
import { useCommands } from "@remirror/react";
import { useAppSelector } from "../../../store/store";
import { useReviewTaskPermissions } from "../../../machines/reviewTask/usePermissions";
import { currentUserId } from "../../../atoms/currentUser";
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
    const [userId] = useAtom(currentUserId);

    const canActOnComment =
        permissions.isAdmin ||
        permissions.isReviewer ||
        permissions.isCrossChecker ||
        permissions.isAssignee;

    const isReplyAuthor =
        !!userId && content.user?._id?.toString() === userId.toString();

    const handleResolveThread = async (event: MouseEvent) => {
        event.stopPropagation();

        try {
            await CommentApi.updateComment(content._id, { resolved: true });
            setIsResolved(true);

            if (enableEditorAnnotations) {
                removeAnnotations([content._id]);
            }

            setComments?.((currentComments: Comment[]) =>
                currentComments.filter((comment) => comment._id !== content._id)
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

    if (content.isReply) {
        if (!isReplyAuthor) return null;

        return (
            <Box className="comment-card-actions" onClick={stopPropagation}>
                <Tooltip title={t("common:delete")}>
                    <span>
                        <AletheiaButton
                            type={ButtonType.white}
                            onClick={handleDeleteReply}
                        >
                            <DeleteOutlineIcon style={{ fontSize: "16px" }} />
                        </AletheiaButton>
                    </span>
                </Tooltip>
            </Box>
        );
    }

    if (!canActOnComment) return null;

    return (
        <Box className="comment-card-actions" onClick={stopPropagation}>
            <Tooltip title={t("common:resolve")}>
                <span>
                    <AletheiaButton
                        type={ButtonType.white}
                        onClick={handleResolveThread}
                    >
                        <CheckIcon style={{ fontSize: "16px" }} />
                    </AletheiaButton>
                </span>
            </Tooltip>
        </Box>
    );
};

export default CommentCardActions;
