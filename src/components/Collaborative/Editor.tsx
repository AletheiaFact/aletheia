import { useContext, useEffect } from "react";

import { CollaborativeEditorContext } from "./CollaborativeEditorProvider";
import { useHelpers } from "@remirror/react";

/**
 * Modifies reference to useful properties those are easier to manipulate.
 * using useHelpers hook that only can be used inside a remirror component
 * @param state remirror state
 * @param editorRef reference to editor
 */
const Editor = ({ state }: { state: any }) => {
    const { setEditorContent } = useContext(CollaborativeEditorContext);
    const { getJSON, getHTML } = useHelpers();

    useEffect(() => {
        setEditorContent({
            JSON: getJSON(),
            html: getHTML(),
        });

        return () => {};
    }, [state, getJSON, getHTML, setEditorContent]);

    return <></>;
};

export default Editor;
