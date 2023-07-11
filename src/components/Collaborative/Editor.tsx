import { useHelpers } from "@remirror/react";
import { useEffect } from "react";

/**
 * Modifies reference to useful properties those are easier to manipulate.
 * using useHelpers hook that only can be used inside a remirror component
 * @param state remirror state
 * @param editorRef reference to editor
 */
const Editor = ({ state, editorRef }: { state: any; editorRef: any }) => {
    const { getJSON, getHTML } = useHelpers();

    useEffect(() => {
        editorRef.current = {
            JSON: getJSON(),
            html: getHTML(),
        };

        return () => {};
    }, [state, getJSON, getHTML, editorRef]);

    return <></>;
};

export default Editor;
