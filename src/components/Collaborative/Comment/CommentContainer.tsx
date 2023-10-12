import "remirror/styles/all.css";

import React, { useContext, useEffect, useState } from "react";
import {
    CommandButton,
    FloatingToolbar,
    useCommands,
    useHelpers,
} from "@remirror/react";
import { CollaborativeEditorContext } from "../CollaborativeEditorProvider";
import { Row } from "antd";
import CommentsList from "./CommentsList";
import { ReviewTaskMachineContext } from "../../../machines/reviewTask/ReviewTaskMachineProvider";
import { useSelector } from "@xstate/react";
import { reviewDataSelector } from "../../../machines/reviewTask/selectors";
import CommentCard from "./CommentCard";
import { ory } from "../../../lib/orysdk";
import userApi from "../../../api/userApi";
import { useAtom } from "jotai";
import { Roles } from "../../../types/enums";
import { currentUserRole } from "../../../atoms/currentUser";

const SuggestionCard = ({ readonly, state }) => {
    const { addAnnotation, setAnnotations } = useCommands();
    const { getAnnotations } = useHelpers();
    const { comments, setComments } = useContext(CollaborativeEditorContext);
    const { machineService } = useContext(ReviewTaskMachineContext);
    const reviewData = useSelector(machineService, reviewDataSelector);
    const [role] = useAtom(currentUserRole);
    const [isCommentVisible, setIsCommentVisible] = useState<boolean>(false);
    const [hasSession, setHasSession] = useState(null);
    const [user, setUser] = useState(null);
    const enabled = addAnnotation.enabled({ id: "" });

    useEffect(() => {
        ory.frontend
            .toSession()
            .then(async ({ data }) => {
                const user = await userApi.getByOryId(data.identity.id);
                setHasSession(true);
                setUser(user);
            })
            .catch(() => {
                setHasSession(false);
            });
    }, [hasSession]);

    useEffect(() => {
        const preloadedComments = comments ? comments : reviewData.comments;
        const commentsUnresolved = preloadedComments.filter(
            (comment) => !comment?.resolved
        );
        setComments(preloadedComments);
        setAnnotations(commentsUnresolved);
    }, [
        comments,
        setComments,
        getAnnotations,
        reviewData.comments,
        setAnnotations,
    ]);

    useEffect(
        () => setComments(getAnnotations()),
        [getAnnotations, setComments, state.doc]
    );

    return (
        <>
            {readonly && role !== Roles.Regular && role !== Roles.FactChecker && (
                <FloatingToolbar>
                    <CommandButton
                        icon="chatNewLine"
                        commandName="addAnnotation"
                        enabled={enabled}
                        onSelect={() => setIsCommentVisible(true)}
                    />
                </FloatingToolbar>
            )}
            <Row
                style={{
                    order: 3,
                    width: "280px",
                    display:
                        isCommentVisible || comments?.length > 0
                            ? "flex"
                            : "none",
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
        </>
    );
};

export default SuggestionCard;
