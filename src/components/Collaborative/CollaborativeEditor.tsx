import {
    AnnotationExtension,
    LinkExtension,
    PlaceholderExtension,
    YjsExtension,
} from "remirror/extensions";
import React, { useCallback, useMemo } from "react";
import { Remirror, useRemirror } from "@remirror/react";

import CollaborativeEditorStyle from "./CollaborativeEditor.style";
import Editor from "./Editor";
import FloatingLinkToolbar from "./LinkToolBar/FloatingLinkToolbar";
import colors from "../../styles/colors";
import { createWebsocketConnection } from "./utils/createWebsocketConnection";
import { useAppSelector } from "../../store/store";

interface CollaborativeEditorProps {
    placeholder: string;
    onContentChange: (state: any) => void;
    editorRef: any;
    error: string;
}

const CollaborativeEditor = ({
    placeholder,
    onContentChange,
    editorRef,
    error,
}: CollaborativeEditorProps) => {
    const { data_hash } = useAppSelector((state) => ({
        data_hash: state?.selectedDataHash,
    }));

    const url = window.location.href;
    const hashIndex = url.indexOf("#");
    const startIndex = url.indexOf("sentence/") + "sentence/".length;
    const endIndex = hashIndex !== -1 ? hashIndex : undefined;
    const url_hash = url.slice(startIndex, endIndex);

    const provider = useMemo(
        () => createWebsocketConnection(data_hash || url_hash),
        [data_hash, url_hash]
    );

    function createExtensions() {
        return [
            new AnnotationExtension(),
            new PlaceholderExtension({ placeholder }),
            new LinkExtension({ autoLink: true }),
            new YjsExtension({ getProvider: () => provider }),
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
            <CollaborativeEditorStyle ref={editorRef}>
                <Remirror
                    manager={manager}
                    initialContent={state}
                    autoFocus
                    autoRender="end"
                    onChange={handleChange}
                >
                    <FloatingLinkToolbar />
                    <Editor state={state} editorRef={editorRef} />
                </Remirror>
            </CollaborativeEditorStyle>
            {error && <span style={{ color: colors.redText }}>{error}</span>}
        </>
    );
};

export default CollaborativeEditor;
