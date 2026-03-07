import React, { useContext } from "react";
import EditorSourcesList from "./Source/EditorSourceList";

import CopilotDrawer from "../../Copilot/CopilotDrawer";
import { useAppSelector } from "../../../store/store";
import { ReviewTaskMachineContext } from "../../../machines/reviewTask/ReviewTaskMachineProvider";
import { VisualEditorContext } from "../VisualEditorProvider";

const ClaimReviewEditor = ({ manager, state, editorSources }) => {
    const { claim, sentenceContent } = useContext(ReviewTaskMachineContext);
    const { data_hash } = useContext(VisualEditorContext);
    const { enableCopilotChatBot, reviewDrawerCollapsed } = useAppSelector(
        (state) => ({
            enableCopilotChatBot: state?.enableCopilotChatBot,
            reviewDrawerCollapsed:
                state?.reviewDrawerCollapsed !== undefined
                    ? state?.reviewDrawerCollapsed
                    : true,
        })
    );

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
                    dataHash={data_hash}
                />
            )}
        </>
    );
};

export default ClaimReviewEditor;
