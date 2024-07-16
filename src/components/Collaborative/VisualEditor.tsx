import React, { useCallback, useContext } from "react";
import { Remirror, useRemirror } from "@remirror/react";
import { VisualEditorContext } from "./VisualEditorProvider";
import VisualEditorStyled from "./VisualEditor.style";
import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import { EditorConfig } from "./utils/getEditorConfig";
import Editor from "./Components/Editor";
import FloatingMenu from "./Components/FloatingMenu";
import AffixPreviewButton from "./Components/AffixPreviewButton";

interface VisualEditorProps {
    onContentChange: (state: any, type: string) => void;
}

const editorConfig = new EditorConfig();

const VisualEditor = ({ onContentChange }: VisualEditorProps) => {
    const { getComponents } = editorConfig;
    const { editorConfiguration, editorSources } =
        useContext(VisualEditorContext);
    const { reviewTaskType } = useContext(ReviewTaskMachineContext);
    const { manager, state, setState } = useRemirror(editorConfiguration);
    const { readonly } = editorConfiguration;
    const getComponentsProps = { state, manager, readonly, editorSources };

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
                <FloatingMenu readonly={readonly} state={state} />
                <Editor editable={readonly} state={state} />
            </Remirror>
            <AffixPreviewButton doc={state.doc} />
        </VisualEditorStyled>
    );
};

export default VisualEditor;
