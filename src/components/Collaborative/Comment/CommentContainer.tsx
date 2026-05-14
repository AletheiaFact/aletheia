import "remirror/styles/all.css";

import React, {
    Dispatch,
    SetStateAction,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useCommands, useHelpers } from "@remirror/react";
import { VisualEditorContext } from "../VisualEditorProvider";
import { Grid } from "@mui/material";
import CommentsList from "./CommentsList";
import { ReviewTaskMachineContext } from "../../../machines/reviewTask/ReviewTaskMachineProvider";
import { useSelector } from "@xstate/react";
import { reviewDataSelector } from "../../../machines/reviewTask/selectors";
import CommentCard from "./CommentCard";
import userApi from "../../../api/userApi";
import { useAtom } from "jotai";
import { currentUserId } from "../../../atoms/currentUser";
import { useAppSelector } from "../../../store/store";
import { usePluginReady } from "../utils/usePluginReady";
import { Comment } from "../../../types/Comment";
import { User } from "../../../types/User";

interface CommentContainerProps {
    state: { doc: { content: { size: number } } };
    isCommentVisible: boolean;
    setIsCommentVisible: Dispatch<SetStateAction<boolean>>;
}

const CommentContainer = ({
    state,
    isCommentVisible,
    setIsCommentVisible,
}: CommentContainerProps) => {
    const enableEditorAnnotations = useAppSelector(
        (state) => state?.enableEditorAnnotations
    );
    const { comments, setComments } = useContext(VisualEditorContext);
    const { machineService } = useContext(ReviewTaskMachineContext);
    const reviewData = useSelector(machineService, reviewDataSelector);
    const [userId] = useAtom(currentUserId);
    const hasSession = !!userId;
    const [user, setUser] = useState<User | null>(null);
    const { setAnnotations } = useCommands();
    const { getAnnotations } = useHelpers();

    const isPluginReady = usePluginReady("annotation", enableEditorAnnotations);

    const crossCheckingComments = useMemo<Comment[]>(
        () =>
            reviewData?.crossCheckingComments?.filter(
                (crossCheckingComment: Comment) =>
                    !crossCheckingComment?.resolved
            ) ?? [],
        [reviewData?.crossCheckingComments]
    );

    useEffect(() => {
        if (hasSession) {
            userApi.getById(userId).then((fetchedUser: User) => {
                setUser(fetchedUser);
            });
        }
    }, [hasSession, userId]);

    useEffect(() => {
        if (comments === null) {
            const reviewComments: Comment[] =
                reviewData?.reviewComments?.filter(
                    (comment: Comment) => !comment?.resolved
                ) ?? [];
            const combinedComments: Comment[] = [
                ...reviewComments,
                ...crossCheckingComments,
            ];

            setComments?.(combinedComments);

            if (enableEditorAnnotations && isPluginReady) {
                const annotations = getAnnotations();
                if (combinedComments.length > 0) {
                    setAnnotations(combinedComments);
                } else if (comments && state.doc.content.size) {
                    setComments?.([
                        ...annotations,
                        ...crossCheckingComments,
                    ]);
                }
            }
        }
    }, [
        comments,
        setComments,
        reviewData?.reviewComments,
        crossCheckingComments,
        isPluginReady,
        setAnnotations,
    ]);

    return (
        <Grid
            container
            style={{
                order: 3,
                width: "280px",
                display:
                    isCommentVisible || (comments?.length ?? 0) > 0
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
                    comment={{} as Comment}
                    isEditing={true}
                />
            )}

            <CommentsList comments={comments as Comment[] | null} user={user} />
        </Grid>
    );
};

export default CommentContainer;