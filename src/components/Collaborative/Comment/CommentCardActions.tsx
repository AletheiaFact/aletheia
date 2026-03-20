import React, { useContext } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckIcon from "@mui/icons-material/Check";
import CommentPopoverContent from "./CommentPopoverContent";
import PopoverClick from "../../Claim/Popover";
import Button, { ButtonType } from "../../Button";
import ReviewTaskApi from "../../../api/reviewTaskApi";
import CommentApi from "../../../api/comment";
import { VisualEditorContext } from "../VisualEditorProvider";
import { useCommands } from "@remirror/react";
import { ReviewTaskMachineContext } from "../../../machines/reviewTask/ReviewTaskMachineProvider";
import { reviewingSelector } from "../../../machines/reviewTask/selectors";
import { useSelector } from "@xstate/react";
import { useAppSelector } from "../../../store/store";
import { useReviewTaskPermissions } from "../../../machines/reviewTask/usePermissions";

const CommentCardActions = ({ content, setIsResolved }) => {
    const enableEditorAnnotations = useAppSelector(
        (state) => state?.enableEditorAnnotations
    );
    const { data_hash, setComments } = useContext(VisualEditorContext);
    const { removeAnnotations } = useCommands();
    const { machineService } = useContext(ReviewTaskMachineContext);
    const isReviewing = useSelector(machineService, reviewingSelector);

    const permissions = useReviewTaskPermissions();
    const canResolveComment =
        permissions.isAdmin ||
        permissions.isReviewer ||
        permissions.isCrossChecker ||
        permissions.isAssignee;

    const handleResolvedClick = async () => {
        await CommentApi.updateComment(content?._id, { resolved: true });
        if (enableEditorAnnotations) {
            removeAnnotations([content?._id]);
        }
        setIsResolved(true);
        // Remove from context array so the panel hides when empty
        // and the comment doesn't reappear on state transitions
        setComments(
            (prev) => prev?.filter((c) => c._id !== content?._id) || []
        );
    };

    const handleDeleteClick = async () => {
        try {
            if (content.isReply) {
                await CommentApi.deleteReplyComment(
                    content.targetId,
                    content._id
                );
                setComments((comments) =>
                    comments.map((comment) =>
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
            } else {
                await ReviewTaskApi.deleteComment(data_hash, content._id);
                setComments((comments) =>
                    comments.filter((c) => c._id !== content?._id)
                );
                if (enableEditorAnnotations) {
                    removeAnnotations([content?._id]);
                }
            }
        } catch (error) {
            console.error("Error handling delete click:", error);
        }
    };

    return (
        <div className="comment-card-actions">
            <div className="comment-card-actions-resolve-button">
                {!content.isReply && canResolveComment && (
                    <Button
                        type={ButtonType.white}
                        onClick={handleResolvedClick}
                    >
                        <CheckIcon style={{ fontSize: "16px" }} />
                    </Button>
                )}
            </div>
            {(permissions.isAdmin ||
                permissions.isReviewer ||
                permissions.isCrossChecker) &&
                isReviewing && (
                    <PopoverClick
                        children={
                            <MoreVertIcon style={{ cursor: "pointer" }} />
                        }
                        content={
                            <CommentPopoverContent
                                handleDeleteClick={handleDeleteClick}
                            />
                        }
                    />
                )}
        </div>
    );
};

export default CommentCardActions;
