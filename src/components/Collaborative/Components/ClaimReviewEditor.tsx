import React, { useContext, useEffect } from "react";
import FloatingLinkToolbar from "./LinkToolBar/FloatingLinkToolbar";
import EditorSourcesList from "./Source/EditorSourceList";

import CopilotDrawer from "../../Copilot/CopilotDrawer";
import { useAppSelector } from "../../../store/store";
import { useDispatch } from "react-redux";
import actions from "../../../store/actions";
import { ReviewTaskMachineContext } from "../../../machines/reviewTask/ReviewTaskMachineProvider";

const ClaimReviewEditor = ({ manager, state, editorSources }) => {
    const { claim, sentenceContent } = useContext(ReviewTaskMachineContext);
    const dispatch = useDispatch();
    const { enableCopilotChatBot, reviewDrawerCollapsed } = useAppSelector(
        (state) => ({
            enableCopilotChatBot: state?.enableCopilotChatBot,
            reviewDrawerCollapsed:
                state?.reviewDrawerCollapsed !== undefined
                    ? state?.reviewDrawerCollapsed
                    : true,
        })
    );

    useEffect(() => {
        if (enableCopilotChatBot && reviewDrawerCollapsed) {
            dispatch(actions.openCopilotDrawer());
        }

        return () => {
            dispatch(actions.closeCopilotDrawer());
        };
    }, []);

    const showCopilot = enableCopilotChatBot && reviewDrawerCollapsed;

    return (
        <>
            <EditorSourcesList
                nodeFromJSON={manager?.schema.nodeFromJSON}
                node={state.doc}
                sources={editorSources}
            />
            {showCopilot && (
                <CopilotDrawer
                    manager={manager}
                    claim={claim}
                    sentence={sentenceContent}
                />
            )}
        </>
    );
};

export default ClaimReviewEditor;
