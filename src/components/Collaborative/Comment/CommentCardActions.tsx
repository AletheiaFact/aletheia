import React, { useContext } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckIcon from "@mui/icons-material/Check";
import CommentPopoverContent from "./CommentPopoverContent";
import { Popover } from "antd";
import Button, { ButtonType } from "../../Button";
import ClaimReviewTaskApi from "../../../api/ClaimReviewTaskApi";
import CommentApi from "../../../api/comment";
import { CollaborativeEditorContext } from "../CollaborativeEditorProvider";
import { useCommands } from "@remirror/react";

const CommentCardActions = ({ content, setIsResolved }) => {
    const { data_hash, setComments } = useContext(CollaborativeEditorContext);
    const { removeAnnotations } = useCommands();
    const handleResolvedClick = async () => {
        await CommentApi.updateComment(content?._id, { resolved: true });
        removeAnnotations([content?._id]);
        setIsResolved(true);
    };

    const handleDeleteClick = async () => {
        try {
            await ClaimReviewTaskApi.deleteComment(data_hash, content._id);
            setComments((comment) => {
                return comment.filter((c) => {
                    return c._id !== content?._id;
                });
            });
            removeAnnotations([content?._id]);
        } catch (error) {
            console.error("Error handling delete click:", error);
        }
    };

    return (
        <div className="comment-card-actions">
            <Button type={ButtonType.white} onClick={handleResolvedClick}>
                <CheckIcon style={{ fontSize: "16px" }} />
            </Button>
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
        </div>
    );
};

export default CommentCardActions;
