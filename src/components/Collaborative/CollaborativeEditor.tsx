import {
    AnnotationExtension,
    LinkExtension,
    PlaceholderExtension,
    YjsExtension,
} from "remirror/extensions";
import React, { useCallback, useContext } from "react";
import { Remirror, useRemirror } from "@remirror/react";

import { CollaborativeEditorContext } from "./CollaborativeEditorProvider";
import CollaborativeEditorStyle from "./CollaborativeEditor.style";
import Editor from "./Editor";
import FloatingLinkToolbar from "./LinkToolBar/FloatingLinkToolbar";
import colors from "../../styles/colors";

interface CollaborativeEditorProps {
    placeholder: string;
    onContentChange: (state: any) => void;
}

const CollaborativeEditor = ({
    placeholder,
    onContentChange,
}: CollaborativeEditorProps) => {
    const { websocketProvider, editorError } = useContext(
        CollaborativeEditorContext
    );
    console.log("websocketProvider", websocketProvider);
    function createExtensions() {
        return [
            new AnnotationExtension(),
            new PlaceholderExtension({ placeholder }),
            new LinkExtension({ autoLink: true }),
            new YjsExtension({ getProvider: () => websocketProvider }),
        ];
    }

    const { manager, state, setState } = useRemirror({
        extensions: createExtensions,
        core: { excludeExtensions: ["history"] },
        stringHandler: "html",
    });

    const handleChange = useCallback(
        ({ state }) => {
            onContentChange(state);
            setState(state);
        },
        [setState, onContentChange]
    );

    return (
        <>
            <CollaborativeEditorStyle>
                <Remirror
                    manager={manager}
                    initialContent={state}
                    autoFocus
                    autoRender="end"
                    onChange={handleChange}
                >
                    <FloatingLinkToolbar />
                    <Editor state={state} />
                </Remirror>
            </CollaborativeEditorStyle>
            {editorError && (
                <span style={{ color: colors.redText }}>{editorError}</span>
            )}
        </>
    );
};

export default CollaborativeEditor;
