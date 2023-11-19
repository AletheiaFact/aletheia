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

const CommentContainer = ({ readonly, state }) => {
    const { comments, setComments } = useContext(CollaborativeEditorContext);
    const { machineService } = useContext(ReviewTaskMachineContext);
    const reviewData = useSelector(machineService, reviewDataSelector);
    const [role] = useAtom(currentUserRole);
    const [isCommentVisible, setIsCommentVisible] = useState<boolean>(false);
    const [hasSession, setHasSession] = useState(null);
    const [user, setUser] = useState(null);
    // const { addAnnotation } = useCommands();
    // const { getAnnotations } = useHelpers();
    // const enabled = addAnnotation?.enabled({ id: "" });
    // const annotations = getAnnotations();

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
        if (comments === null) {
            const reviewComments = reviewData?.reviewComments?.filter(
                (comment) => !comment?.resolved
            );
            const crossCheckingComments =
                reviewData?.crossCheckingComments?.filter(
                    (crossCheckingComment) => !crossCheckingComment?.resolved
                );
            setComments([
                ...(reviewComments ? reviewComments : []),
                ...(crossCheckingComments ? crossCheckingComments : []),
            ]);
        }
    }, [comments, setComments, reviewData?.comments]);

    // useEffect(() => {
    //     if ((comments && annotations.length === 0) || (state.doc.content.size === annotations[0]?.from)) {
    //         setAnnotations(comments);
    //     } else if (comments && state.doc.content.size) {
    //         setComments(annotations);
    //     }
    // }, [setAnnotations, setComments, state.doc]);

    return (
        <>
            {readonly && role !== Roles.Regular && role !== Roles.FactChecker && (
                <FloatingToolbar>
                    <CommandButton
                        icon="chatNewLine"
                        commandName="addAnnotation"
                        enabled={true}
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

export default CommentContainer;
