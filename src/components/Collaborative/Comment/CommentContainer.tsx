import "remirror/styles/all.css";

import React, { useCallback, useContext, useEffect, useState } from "react";
import {
    CommandButton,
    FloatingToolbar,
    useCommands,
    useCurrentSelection,
    useHelpers,
} from "@remirror/react";
import AletheiaInput from "../../AletheiaInput";
import AletheiaButton, { ButtonType } from "../../Button";
import ClaimReviewTaskApi from "../../../api/ClaimReviewTaskApi";
import { CollaborativeEditorContext } from "../CollaborativeEditorProvider";
import { Avatar } from "@mui/material";
import colors from "../../../styles/colors";
import CardBase from "../../CardBase";
import { Row } from "antd";
import CommentsList from "./CommentsList";
import CommentApi from "../../../api/comment";
import userApi from "../../../api/userApi";
import { ory } from "../../../lib/orysdk";
import { ReviewTaskMachineContext } from "../../../machines/reviewTask/ReviewTaskMachineProvider";
import { useSelector } from "@xstate/react";
import { reviewDataSelector } from "../../../machines/reviewTask/selectors";

const SuggestionCard = ({ readonly, state }) => {
    const { from, to, $to } = useCurrentSelection();
    const { addAnnotation, setAnnotations } = useCommands();
    const { getAnnotations } = useHelpers();
    const { data_hash, comments, setComments } = useContext(
        CollaborativeEditorContext
    );
    const { machineService } = useContext(ReviewTaskMachineContext);
    const reviewData = useSelector(machineService, reviewDataSelector);

    const [isCommentVisible, setIsCommentVisible] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [commentValue, setCommentValue] = useState("");
    const [hasSession, setHasSession] = useState<boolean>(null);
    const [user, setUser] = useState(null);

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
        const preloadedComments =
            comments?.length > 0 ? comments : reviewData.comments;
        setComments(preloadedComments);
        setAnnotations(preloadedComments);
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

    const handleOnSubmit = useCallback(async () => {
        setIsLoading(true);
        const text = $to.doc.textBetween(from, to);
        try {
            const newComment = {
                from,
                to,
                text,
                comment: commentValue,
                user: user._id,
            };
            const createdComment = await CommentApi.createComment(newComment);
            if (addAnnotation.enabled({ id: createdComment._id })) {
                await ClaimReviewTaskApi.addComment(
                    data_hash,
                    createdComment._id
                );
                addAnnotation({ id: createdComment._id });
                setComments((comments) => {
                    if (comments) {
                        return [...comments, createdComment];
                    }
                    return [createdComment];
                });
            }
        } catch (e) {
            console.log(e);
        } finally {
            setCommentValue("");
            setIsCommentVisible(false);
            setIsLoading(false);
        }
    }, [
        $to.doc,
        addAnnotation,
        commentValue,
        data_hash,
        from,
        setComments,
        to,
        user?._id,
    ]);

    const handleCancel = () => {
        setIsCommentVisible(false);
        setCommentValue("");
    };

    console.log("comments", comments);
    const enabled = addAnnotation.enabled({ id: "" });

    return (
        <>
            {readonly && (
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
                    order: 4,
                    width: "400px",
                    display:
                        isCommentVisible || comments?.length > 0
                            ? "flex"
                            : "none",
                    flexDirection: "column",
                    gap: 8,
                }}
            >
                <CardBase
                    style={{
                        display: isCommentVisible ? "flex" : "none",
                        padding: "16px",
                        gap: 16,
                        maxHeight: "180px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}
                    >
                        <Avatar
                            style={{
                                margin: 0,
                                background: colors.blueQuartiary,
                                width: "32px",
                                height: "32px",
                                fontSize: "16px",
                                paddingTop: 4,
                            }}
                        >
                            {user?.name?.slice(0, 1)}
                        </Avatar>
                        <p style={{ margin: 0, paddingTop: 4 }}>{user?.name}</p>
                    </div>
                    <AletheiaInput
                        value={commentValue}
                        onChange={({ target }) => setCommentValue(target.value)}
                    />
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                        }}
                    >
                        <AletheiaButton
                            onClick={handleOnSubmit}
                            loading={isLoading}
                        >
                            Submit
                        </AletheiaButton>
                        <AletheiaButton
                            type={ButtonType.whiteBlack}
                            onClick={handleCancel}
                            loading={isLoading}
                        >
                            Cancel
                        </AletheiaButton>
                    </div>
                </CardBase>

                <CommentsList comments={comments} user={user} />
            </Row>
        </>
    );
};

export default SuggestionCard;
