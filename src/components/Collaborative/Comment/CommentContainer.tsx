import "remirror/styles/all.css";

import React, { useContext, useEffect, useMemo, useState } from "react";
import { useCommands, useHelpers, useRemirrorContext } from "@remirror/react";
import { VisualEditorContext } from "../VisualEditorProvider";
import { Row } from "antd";
import CommentsList from "./CommentsList";
import { ReviewTaskMachineContext } from "../../../machines/reviewTask/ReviewTaskMachineProvider";
import { useSelector } from "@xstate/react";
import { reviewDataSelector } from "../../../machines/reviewTask/selectors";
import CommentCard from "./CommentCard";
import userApi from "../../../api/userApi";
import { useAtom } from "jotai";
import { currentUserId } from "../../../atoms/currentUser";
import { useAppSelector } from "../../../store/store";

const CommentContainer = ({ state, isCommentVisible, setIsCommentVisible }) => {
    const { getPluginState } = useRemirrorContext({ autoUpdate: true });
    const enableEditorAnnotations = useAppSelector(
        (state) => state?.enableEditorAnnotations
    );
    const { comments, setComments } = useContext(VisualEditorContext);
    const { machineService } = useContext(ReviewTaskMachineContext);
    const reviewData = useSelector(machineService, reviewDataSelector);
    const [userId] = useAtom(currentUserId);
    const hasSession = !!userId;
    const [user, setUser] = useState(null);
    const { setAnnotations } = useCommands();
    const { getAnnotations } = useHelpers();
    const pluginState = getPluginState("annotation");

    // Safely calls getAnnotations() by first checking if pluginState exists.
    const annotations = pluginState ? getAnnotations() : [];

    const crossCheckingComments = useMemo(
        () =>
            reviewData?.crossCheckingComments?.filter(
                (crossCheckingComment) => !crossCheckingComment?.resolved
            ),
        [reviewData?.crossCheckingComments]
    );

    useEffect(() => {
        if (hasSession) {
            userApi.getById(userId).then((user) => {
                setUser(user);
            });
        }
    }, [hasSession, userId]);

    useEffect(() => {
        if (comments === null) {
            const reviewComments = reviewData?.reviewComments?.filter(
                (comment) => !comment?.resolved
            );
            setComments([
                ...(reviewComments ? reviewComments : []),
                ...(crossCheckingComments ? crossCheckingComments : []),
            ]);
        }
    }, [comments, setComments, reviewData?.comments]);

    useEffect(() => {
        if (enableEditorAnnotations) {
            if (
                (comments && annotations?.length === 0) ||
                state.doc.content.size === annotations[0]?.from
            ) {
                setAnnotations(comments);
            } else if (comments && state.doc.content.size) {
                setComments([...annotations, ...crossCheckingComments]);
            }
        }
    }, [setAnnotations, setComments, state.doc]);

    return (
        <Row
            style={{
                order: 3,
                width: "280px",
                display:
                    isCommentVisible || comments?.length > 0 ? "flex" : "none",
                flexDirection: "column",
                gap: 8,
            }}
        >
            {isCommentVisible && (
                <CommentCard
                    setIsCommentVisible={setIsCommentVisible}
                    user={user}
                    isEditing={true}
                />
            )}

            <CommentsList comments={comments} user={user} />
        </Row>
    );
};

export default CommentContainer;
