import React, { useCallback, useContext, useEffect } from "react";
import { Remirror, useRemirror } from "@remirror/react";

import { VisualEditorContext } from "./VisualEditorProvider";
import VisualEditorStyled from "./VisualEditor.style";
import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import { EditorConfig } from "./utils/getEditorConfig";
import CopilotDrawer from "../Copilot/CopilotDrawer";
import { useAppSelector } from "../../store/store";
import Editor from "./Components/Editor";
import { ReviewTaskTypeEnum } from "../../machines/reviewTask/enums";
import CommentContainer from "./Comment/CommentContainer";
import { useDispatch } from "react-redux";
import actions from "../../store/actions";

interface VisualEditorProps {
    onContentChange: (state: any, type: string) => void;
}

const editorConfig = new EditorConfig();

const VisualEditor = ({ onContentChange }: VisualEditorProps) => {
    const { getComponents } = editorConfig;
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

    const { editorConfiguration, editorSources } =
        useContext(VisualEditorContext);
    const { reviewTaskType, claim, sentenceContent } = useContext(
        ReviewTaskMachineContext
    );
    const { manager, state, setState } = useRemirror(editorConfiguration);
    const { readonly } = editorConfiguration;
    const getComponentsProps = { state, manager, readonly, editorSources };
    const showCopilot =
        reviewTaskType === ReviewTaskTypeEnum.Claim &&
        enableCopilotChatBot &&
        reviewDrawerCollapsed;

    useEffect(() => {
        if (enableCopilotChatBot && reviewDrawerCollapsed) {
            dispatch(actions.openCopilotDrawer());
        }

        return () => {
            dispatch(actions.closeCopilotDrawer());
        };
    }, []);

    const handleChange = useCallback(
        ({ state }) => {
            onContentChange(state, reviewTaskType);
            setState(state);
        },
        [setState, onContentChange, reviewTaskType]
    );

    return (
        <VisualEditorStyled>
            <Remirror
                manager={manager}
                initialContent={state}
                autoFocus
                autoRender="end"
                onChange={handleChange}
                editable={!readonly}
            >
                {getComponents(reviewTaskType, getComponentsProps)}

                {showCopilot && (
                    <CopilotDrawer
                        manager={manager}
                        claim={claim}
                        sentence={sentenceContent}
                    />
                )}
                <CommentContainer readonly={readonly} state={state} />
                <Editor editable={readonly} state={state} />
            </Remirror>
        </VisualEditorStyled>
    );
};

export default VisualEditor;
