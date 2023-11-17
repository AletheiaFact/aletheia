import React, { useContext } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckIcon from "@mui/icons-material/Check";
import CommentPopoverContent from "./CommentPopoverContent";
import { Popover } from "antd";
import Button, { ButtonType } from "../../Button";
import ClaimReviewTaskApi from "../../../api/ClaimReviewTaskApi";
import CommentApi from "../../../api/comment";
import { CollaborativeEditorContext } from "../CollaborativeEditorProvider";
// import { useCommands } from "@remirror/react";
import { currentUserRole } from "../../../atoms/currentUser";
import { useAtom } from "jotai";
import { ReviewTaskMachineContext } from "../../../machines/reviewTask/ReviewTaskMachineProvider";
import { reviewingSelector } from "../../../machines/reviewTask/selectors";
import { useSelector } from "@xstate/react";
import { Roles } from "../../../types/enums";

const CommentCardActions = ({ content, setIsResolved }) => {
    const { data_hash, setComments } = useContext(CollaborativeEditorContext);
    // const { removeAnnotations } = useCommands();
    const [role] = useAtom(currentUserRole);
    const { machineService } = useContext(ReviewTaskMachineContext);
    const isReviewing = useSelector(machineService, reviewingSelector);

    const handleResolvedClick = async () => {
        await CommentApi.updateComment(content?._id, { resolved: true });
        // removeAnnotations([content?._id]);
        setIsResolved(true);
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
                await ClaimReviewTaskApi.deleteComment(data_hash, content._id);
                setComments((comments) =>
                    comments.filter((c) => c._id !== content?._id)
                );
                // removeAnnotations([content?._id]);
            }
        } catch (error) {
            console.error("Error handling delete click:", error);
        }
    };

    return (
        <div className="comment-card-actions">
            <div className="comment-card-actions-resolve-button">
                {!content.isReply && (
                    <Button
                        type={ButtonType.white}
                        onClick={handleResolvedClick}
                    >
                        <CheckIcon style={{ fontSize: "16px" }} />
                    </Button>
                )}
            </div>
            {role !== Roles.Regular &&
                role !== Roles.FactChecker &&
                isReviewing && (
                    <Popover
                        trigger="click"
                        placement="bottom"
                        overlayInnerStyle={{ padding: 0 }}
                        content={
                            <CommentPopoverContent
                                handleDeleteClick={handleDeleteClick}
                            />
                        }
                    >
                        <MoreVertIcon style={{ cursor: "pointer" }} />
                    </Popover>
                )}
        </div>
    );
};

export default CommentCardActions;
